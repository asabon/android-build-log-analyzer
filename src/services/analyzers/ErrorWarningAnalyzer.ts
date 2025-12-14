import { Analyzer, AnalysisResult } from './Analyzer';
import * as core from '@actions/core';

interface Issue {
    type: 'Error' | 'Warning';
    message: string;
    lines: number[];
}

export class ErrorWarningAnalyzer implements Analyzer {
    analyze(lines: string[]): AnalysisResult {
        const issuesMap = new Map<string, Issue>();
        let errorCount = 0;
        let warningCount = 0;

        lines.forEach((line, index) => {
            const lineNum = index + 1;
            let type: 'Error' | 'Warning' | null = null;

            // Regex tweaks to catch "e:" (Kotlin), "Error:", "w:" (Kotlin), "Warning:"
            // and keep word boundary for standard text.
            if (/(\berror\b|^e:)/i.test(line)) {
                type = 'Error';
            } else if (/(\bwarning\b|^w:)/i.test(line)) {
                type = 'Warning';
            }

            if (type) {
                const message = line.trim();
                const existing = issuesMap.get(message);

                if (existing) {
                    if (existing.type === type) { // only group if type matches (unlikely to differ for same message)
                        existing.lines.push(lineNum);
                    } else {
                        // Should technically treat as new if type differs, but message is same? 
                        // Let's just create a unique key if we really care, but message is likely unique enough.
                        // For simplicity, just update.
                        existing.lines.push(lineNum);
                    }
                } else {
                    issuesMap.set(message, {
                        type: type,
                        message: message,
                        lines: [lineNum]
                    });
                }

                if (type === 'Error') {
                    core.error(message, { title: `Line ${lineNum}` });
                    errorCount++;
                } else {
                    core.warning(message, { title: `Line ${lineNum}` });
                    warningCount++;
                }
            }
        });

        // Generate Markdown
        let markdown = `### Error and Warning Analysis\n\n`;
        markdown += `Found **${errorCount}** errors and **${warningCount}** warnings.\n\n`;

        if (issuesMap.size > 0) {
            markdown += `| Type | Lines | Message |\n`;
            markdown += `| :--- | :--- | :--- |\n`;

            // Convert map to array and sort errors first
            const sortedIssues = Array.from(issuesMap.values()).sort((a, b) => {
                if (a.type === b.type) return 0;
                return a.type === 'Error' ? -1 : 1;
            });

            sortedIssues.forEach(issue => {
                const icon = issue.type === 'Error' ? '🛑' : '⚠️';
                const safeMessage = issue.message.replace(/\|/g, '\\|');

                // Format lines: "1, 5, 10" or "1 (x5)" if too many?
                // Let's list up to 3, then "and N others"
                let lineStr = issue.lines.join(', ');
                if (issue.lines.length > 5) {
                    lineStr = `${issue.lines.slice(0, 3).join(', ')} ... and ${issue.lines.length - 3} others`;
                }

                markdown += `| ${icon} ${issue.type} | ${lineStr} | \`${safeMessage}\` |\n`;
            });
        } else {
            markdown += `✅ No errors or warnings found.\n`;
        }

        return {
            name: 'Error and Warning Analysis',
            markdown: markdown,
            isFailed: errorCount > 0,
            failureMessage: errorCount > 0 ? `Found ${errorCount} errors in the build log.` : undefined
        };
    }
}

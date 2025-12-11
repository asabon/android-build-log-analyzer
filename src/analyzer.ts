import * as core from '@actions/core';
import * as fs from 'fs';

export async function run(): Promise<void> {
    try {
        const logFilePath = core.getInput('log-file-path');
        core.info(`Analyzing log file at: ${logFilePath}`);

        if (!fs.existsSync(logFilePath)) {
            throw new Error(`Log file not found at: ${logFilePath}`);
        }

        const content = fs.readFileSync(logFilePath, 'utf-8');
        const lines = content.split('\n');

        const issues: { type: 'Error' | 'Warning'; message: string; line: number }[] = [];

        lines.forEach((line, index) => {
            // Use regex with word boundary to avoid partial matches
            // e.g. "checkKotlinGradlePluginConfigurationErrors" should not match
            if (/\berror\b/i.test(line)) {
                core.error(line.trim(), { title: `Line ${index + 1}` });
                issues.push({ type: 'Error', message: line.trim(), line: index + 1 });
            } else if (/\bwarning\b/i.test(line)) {
                core.warning(line.trim(), { title: `Line ${index + 1}` });
                issues.push({ type: 'Warning', message: line.trim(), line: index + 1 });
            }
        });

        const errorCount = issues.filter(i => i.type === 'Error').length;
        const warningCount = issues.filter(i => i.type === 'Warning').length;

        core.info(`Analysis complete. Found ${errorCount} errors and ${warningCount} warnings.`);

        // Generate Markdown Report
        let markdown = `## Android Build Log Analysis\n\n`;
        markdown += `Found **${errorCount}** errors and **${warningCount}** warnings.\n\n`;

        if (issues.length > 0) {
            markdown += `| Type | Line | Message |\n`;
            markdown += `| :--- | :--- | :--- |\n`;
            issues.forEach(issue => {
                const icon = issue.type === 'Error' ? '🛑' : '⚠️';
                // Escape pipes in message to prevent breaking the table
                const safeMessage = issue.message.replace(/\|/g, '\\|');
                markdown += `| ${icon} ${issue.type} | ${issue.line} | \`${safeMessage}\` |\n`;
            });
        } else {
            markdown += `✅ No errors or warnings found.\n`;
        }

        // Output to Job Summary
        await core.summary.addRaw(markdown).write();

        // Output to Report File if path is specified
        const reportPath = core.getInput('report-path');
        if (reportPath) {
            fs.writeFileSync(reportPath, markdown);
            core.info(`Report saved to: ${reportPath}`);
        }

        if (errorCount > 0) {
            core.setFailed(`Found ${errorCount} errors in the build log.`);
        }

    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message);
    }
}

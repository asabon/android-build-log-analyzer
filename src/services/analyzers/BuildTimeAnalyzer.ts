import { Analyzer, AnalysisResult } from './Analyzer';

interface TaskInfo {
    name: string;
    outcome: string; // UP-TO-DATE, SKIPPED, FROM-CACHE, EXECUTED (default)
    duration?: string; // If available
}

export class BuildTimeAnalyzer implements Analyzer {
    analyze(lines: string[]): AnalysisResult {
        const tasks: TaskInfo[] = [];
        let totalTime = 'Unknown';

        // Regex for Task lines: > Task :app:assembleDebug UP-TO-DATE
        // capturing: name, outcome (optional)
        const taskRegex = /> Task ([^\s]+)\s*([A-Z-]+)?/;

        // Regex for Build Duration: BUILD SUCCESSFUL in 2m 3s
        // Note: It might be "BUILD FAILED" too.
        const buildResultRegex = /BUILD (SUCCESSFUL|FAILED) in (.*)/;

        lines.forEach(line => {
            const taskMatch = line.match(taskRegex);
            if (taskMatch) {
                const name = taskMatch[1];
                const outcome = taskMatch[2] || 'EXECUTED';
                tasks.push({ name, outcome });
            }

            const resultMatch = line.match(buildResultRegex);
            if (resultMatch) {
                totalTime = resultMatch[2].trim();
            }
        });

        const executed = tasks.filter(t => t.outcome === 'EXECUTED').length;
        const upToDate = tasks.filter(t => t.outcome === 'UP-TO-DATE').length;
        const skipped = tasks.filter(t => t.outcome === 'SKIPPED').length;
        const fromCache = tasks.filter(t => t.outcome === 'FROM-CACHE').length;
        // Gradle 8.0+ configuration cache lines might differ, but this is a good start.

        let markdown = `### Build Performance Summary\n\n`;
        markdown += `- **Total Build Time**: ${totalTime}\n`;
        markdown += `- **Total Tasks**: ${tasks.length}\n`;
        markdown += `  - Executed: ${executed}\n`;
        markdown += `  - CACHED / UP-TO-DATE: ${fromCache + upToDate}\n`;
        markdown += `  - SKIPPED: ${skipped}\n\n`;

        // If we had per-task timing, we would list top 5 here.
        // For now, standard logs don't guarantee this, so we omit unless we implement timestamp diffing (complex).
        // Feature expansion usage: analyzing timestamps if lines start with them.

        return {
            name: 'Build Performance',
            markdown: markdown,
            isFailed: false // Performance stats usually don't fail the build analysis itself
        };
    }
}

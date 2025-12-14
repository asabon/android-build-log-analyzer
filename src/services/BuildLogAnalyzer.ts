import { Analyzer, AnalysisResult } from './analyzers/Analyzer';

export class BuildLogAnalyzer {
    private analyzers: Analyzer[] = [];

    addAnalyzer(analyzer: Analyzer) {
        this.analyzers.push(analyzer);
    }

    analyze(logContent: string): { results: AnalysisResult[]; fullReport: string; isFailed: boolean; failureMessage: string } {
        const lines = logContent.split('\n');
        const results: AnalysisResult[] = [];
        let combinedMarkdown = '## Android Build Log Analysis\n\n';
        let isFailed = false; // logic changes slightly, see logic below
        let failureMessages: string[] = [];

        for (const analyzer of this.analyzers) {
            try {
                const result = analyzer.analyze(lines);
                results.push(result);
                combinedMarkdown += result.markdown + '\n';

                if (result.isFailed) {
                    isFailed = true;
                    if (result.failureMessage) {
                        failureMessages.push(result.failureMessage);
                    }
                }
            } catch (err) {
                console.error(`Analyzer failed`, err);
                combinedMarkdown += `\n> [!ERROR]\n> Analyzer failed: ${err}\n`;
            }
        }

        const failureMessage = failureMessages.length > 0 ? failureMessages.join(', ') : '';

        return { results, fullReport: combinedMarkdown, isFailed, failureMessage };
    }
}

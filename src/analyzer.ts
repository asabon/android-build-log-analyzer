import * as core from '@actions/core';
import * as fs from 'fs';
import { BuildLogAnalyzer } from './services/BuildLogAnalyzer';
import { ErrorWarningAnalyzer } from './services/analyzers/ErrorWarningAnalyzer';
import { BuildTimeAnalyzer } from './services/analyzers/BuildTimeAnalyzer';

export async function run(): Promise<void> {
    try {
        const logFilePath = core.getInput('log-file-path');
        core.info(`Analyzing log file at: ${logFilePath}`);

        if (!fs.existsSync(logFilePath)) {
            throw new Error(`Log file not found at: ${logFilePath}`);
        }

        const content = fs.readFileSync(logFilePath, 'utf-8');

        const analyzer = new BuildLogAnalyzer();
        // Add analyzers - order matters for report appearance
        analyzer.addAnalyzer(new BuildTimeAnalyzer());
        analyzer.addAnalyzer(new ErrorWarningAnalyzer());

        const result = analyzer.analyze(content);

        // Output to Job Summary
        await core.summary.addRaw(result.fullReport).write();

        // Output to Report File if path is specified
        const reportPath = core.getInput('report-path');
        if (reportPath) {
            fs.writeFileSync(reportPath, result.fullReport);
            core.info(`Report saved to: ${reportPath}`);
        }

        if (result.isFailed) {
            core.setFailed(result.failureMessage || 'Build analysis failed with errors.');
        } else {
            core.info('Build analysis completed successfully.');
        }

    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message);
    }
}

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

        let errorCount = 0;
        let warningCount = 0;

        lines.forEach((line, index) => {
            const lowerLine = line.toLowerCase();
            if (lowerLine.includes('error')) {
                core.error(line.trim(), { title: `Line ${index + 1}` });
                errorCount++;
            } else if (lowerLine.includes('warning')) {
                core.warning(line.trim(), { title: `Line ${index + 1}` });
                warningCount++;
            }
        });

        core.info(`Analysis complete. Found ${errorCount} errors and ${warningCount} warnings.`);

        if (errorCount > 0) {
            core.setFailed(`Found ${errorCount} errors in the build log.`);
        }

    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message);
    }
}

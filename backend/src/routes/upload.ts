import { Router, Request, Response } from 'express';
import multer from 'multer';
import Papa from 'papaparse';
import { extractCRMDataWithAI } from '../services/aiService';
import fs from 'fs';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const fileContent = fs.readFileSync(req.file.path, 'utf-8');
        
        // Parse CSV
        const parsedCsv = Papa.parse(fileContent, {
            header: true,
            skipEmptyLines: true,
        });

        const rawRows = parsedCsv.data;
        if (rawRows.length === 0) {
            res.status(400).json({ error: 'CSV file is empty' });
            return;
        }

        // Batch processing (e.g. 20 rows per batch)
        const batchSize = 20;
        const allRecords: any[] = [];
        const allSkipped: any[] = [];

        for (let i = 0; i < rawRows.length; i += batchSize) {
            const batch = rawRows.slice(i, i + batchSize);
            const { records, skipped } = await extractCRMDataWithAI(batch);
            allRecords.push(...records);
            allSkipped.push(...skipped);
        }

        // Cleanup uploaded file
        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            totalImported: allRecords.length,
            totalSkipped: allSkipped.length,
            records: allRecords,
            skipped: allSkipped
        });

    } catch (error: any) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

export default router;

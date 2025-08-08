import pool from './db';
import * as fs from 'fs';
import * as path from 'path';

async function runMigration() {
    try {
        console.log('Running migration: Fix exercise unique constraint...');
        
        const migrationSQL = fs.readFileSync(
            path.join(__dirname, 'migrations', '001_fix_exercise_unique_constraint.sql'),
            'utf8'
        );
        
        await pool.query(migrationSQL);
        
        console.log('Migration completed successfully!');
        console.log('Users can now recreate exercises with the same name after deleting them.');
        
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await pool.end();
    }
}

runMigration();

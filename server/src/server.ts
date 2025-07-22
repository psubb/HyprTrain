import app from './app';

const PORT: number = parseInt(process.env.PORT || '8080', 10);

app.listen(PORT, (): void => {
    console.log(`Server is running on port ${PORT}`);
});
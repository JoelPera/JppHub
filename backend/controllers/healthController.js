// ========== CONTROLADOR DE HEALTH CHECK ==========
export class HealthController {
    static async checkHealth(req, res) {
        const uptime = process.uptime();
        const memoryUsage = process.memoryUsage();

        res.json({
            status: 'success',
            message: 'Servidor funcionando correctamente',
            server: {
                uptime: `${Math.floor(uptime)} segundos`,
                memory: {
                    heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
                    heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`
                },
                environment: process.env.NODE_ENV || 'development',
                timestamp: new Date().toISOString()
            }
        });
    }
}

export default HealthController;

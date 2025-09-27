const express = require('express');
const router = express.Router();

// Временные данные для демонстрации
let evacuationAnalyticsData = [
    {
        id: 1,
        date: '2024-01-15',
        totalEvacuations: 45,
        successfulEvacuations: 42,
        failedEvacuations: 3,
        averageTime: 12.5,
        peakHour: '08:00-09:00',
        weatherConditions: 'Clear',
        trafficDensity: 'High',
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-15T10:00:00Z')
    },
    {
        id: 2,
        date: '2024-01-16',
        totalEvacuations: 38,
        successfulEvacuations: 35,
        failedEvacuations: 3,
        averageTime: 14.2,
        peakHour: '17:00-18:00',
        weatherConditions: 'Rain',
        trafficDensity: 'Medium',
        createdAt: new Date('2024-01-16T10:00:00Z'),
        updatedAt: new Date('2024-01-16T10:00:00Z')
    }
];

// GET all evacuation analytics
router.get('/', (req, res) => {
    try {
        res.json({
            success: true,
            data: evacuationAnalyticsData,
            total: evacuationAnalyticsData.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Ошибка получения данных аналитики эвакуации'
        });
    }
});

// GET evacuation analytics by ID
router.get('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const analytics = evacuationAnalyticsData.find(item => item.id === id);
        
        if (!analytics) {
            return res.status(404).json({
                success: false,
                error: 'Аналитика эвакуации не найдена'
            });
        }
        
        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Ошибка получения аналитики эвакуации'
        });
    }
});

// POST new evacuation analytics
router.post('/', async (req, res) => {
    try {
        const newAnalytics = Object.assign({
            id: evacuationAnalyticsData.length + 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }, req.body);
        
        evacuationAnalyticsData.push(newAnalytics);
        
        res.status(201).json({
            success: true,
            message: 'Аналитика эвакуации создана успешно',
            data: newAnalytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Ошибка создания аналитики эвакуации'
        });
    }
});

// PUT update evacuation analytics
router.put('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const index = evacuationAnalyticsData.findIndex(item => item.id === id);
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                error: 'Аналитика эвакуации не найдена'
            });
        }
        
        evacuationAnalyticsData[index] = Object.assign(evacuationAnalyticsData[index], req.body, {
            updatedAt: new Date()
        });
        
        res.json({
            success: true,
            message: 'Аналитика эвакуации обновлена успешно',
            data: evacuationAnalyticsData[index]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Ошибка обновления аналитики эвакуации'
        });
    }
});

// DELETE evacuation analytics
router.delete('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const index = evacuationAnalyticsData.findIndex(item => item.id === id);
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                error: 'Аналитика эвакуации не найдена'
            });
        }
        
        evacuationAnalyticsData.splice(index, 1);
        
        res.json({
            success: true,
            message: 'Аналитика эвакуации удалена успешно'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Ошибка удаления аналитики эвакуации'
        });
    }
});

module.exports = router;
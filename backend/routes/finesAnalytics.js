const express = require('express');
const router = express.Router();

// Временные данные для демонстрации
let finesAnalyticsData = [
    {
        id: 1,
        date: '2024-01-15',
        totalFines: 150,
        totalAmount: 45000,
        averageAmount: 300,
        byType: {
            'Превышение скорости': 45,
            'Неправильная парковка': 60,
            'Проезд на красный': 25,
            'Другие нарушения': 20
        },
        byDistrict: {
            'Центральный': 50,
            'Северный': 40,
            'Южный': 35,
            'Восточный': 25
        },
        peakHour: '08:00-09:00',
        weatherConditions: 'Clear',
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-15T10:00:00Z')
    },
    {
        id: 2,
        date: '2024-01-16',
        totalFines: 180,
        totalAmount: 54000,
        averageAmount: 300,
        byType: {
            'Превышение скорости': 55,
            'Неправильная парковка': 70,
            'Проезд на красный': 30,
            'Другие нарушения': 25
        },
        byDistrict: {
            'Центральный': 60,
            'Северный': 50,
            'Южный': 40,
            'Восточный': 30
        },
        peakHour: '17:00-18:00',
        weatherConditions: 'Rain',
        createdAt: new Date('2024-01-16T10:00:00Z'),
        updatedAt: new Date('2024-01-16T10:00:00Z')
    }
];

// GET all fines analytics
router.get('/', (req, res) => {
    try {
        res.json({
            success: true,
            data: finesAnalyticsData,
            total: finesAnalyticsData.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Ошибка получения данных аналитики штрафов'
        });
    }
});

// GET fines analytics by ID
router.get('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const analytics = finesAnalyticsData.find(item => item.id === id);
        
        if (!analytics) {
            return res.status(404).json({
                success: false,
                error: 'Аналитика штрафов не найдена'
            });
        }
        
        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Ошибка получения аналитики штрафов'
        });
    }
});

// POST new fines analytics
router.post('/', async (req, res) => {
    try {
        const newAnalytics = Object.assign({
            id: finesAnalyticsData.length + 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }, req.body);
        
        finesAnalyticsData.push(newAnalytics);
        
        res.status(201).json({
            success: true,
            message: 'Аналитика штрафов создана успешно',
            data: newAnalytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Ошибка создания аналитики штрафов'
        });
    }
});

// PUT update fines analytics
router.put('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const index = finesAnalyticsData.findIndex(item => item.id === id);
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                error: 'Аналитика штрафов не найдена'
            });
        }
        
        finesAnalyticsData[index] = Object.assign(finesAnalyticsData[index], req.body, {
            updatedAt: new Date()
        });
        
        res.json({
            success: true,
            message: 'Аналитика штрафов обновлена успешно',
            data: finesAnalyticsData[index]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Ошибка обновления аналитики штрафов'
        });
    }
});

// DELETE fines analytics
router.delete('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const index = finesAnalyticsData.findIndex(item => item.id === id);
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                error: 'Аналитика штрафов не найдена'
            });
        }
        
        finesAnalyticsData.splice(index, 1);
        
        res.json({
            success: true,
            message: 'Аналитика штрафов удалена успешно'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Ошибка удаления аналитики штрафов'
        });
    }
});

module.exports = router;
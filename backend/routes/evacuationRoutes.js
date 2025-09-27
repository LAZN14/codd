const express = require('express');
const router = express.Router();

// Временные данные для демонстрации
let evacuationRoutesData = [
    {
        id: 1,
        routeName: 'Маршрут эвакуации №1',
        startPoint: 'Центр города',
        endPoint: 'Безопасная зона А',
        distance: 15.5,
        estimatedTime: 25,
        capacity: 500,
        status: 'active',
        priority: 'high',
        description: 'Основной маршрут эвакуации из центральной части города',
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-15T10:00:00Z')
    },
    {
        id: 2,
        routeName: 'Маршрут эвакуации №2',
        startPoint: 'Промышленная зона',
        endPoint: 'Безопасная зона Б',
        distance: 22.3,
        estimatedTime: 35,
        capacity: 300,
        status: 'active',
        priority: 'medium',
        description: 'Альтернативный маршрут для промышленной зоны',
        createdAt: new Date('2024-01-16T10:00:00Z'),
        updatedAt: new Date('2024-01-16T10:00:00Z')
    }
];

// GET all evacuation routes
router.get('/', (req, res) => {
    try {
        res.json({
            success: true,
            data: evacuationRoutesData,
            total: evacuationRoutesData.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Ошибка получения маршрутов эвакуации'
        });
    }
});

// GET evacuation route by ID
router.get('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const route = evacuationRoutesData.find(item => item.id === id);
        
        if (!route) {
            return res.status(404).json({
                success: false,
                error: 'Маршрут эвакуации не найден'
            });
        }
        
        res.json({
            success: true,
            data: route
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Ошибка получения маршрута эвакуации'
        });
    }
});

// POST new evacuation route
router.post('/', async (req, res) => {
    try {
        const newRoute = Object.assign({
            id: evacuationRoutesData.length + 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }, req.body);
        
        evacuationRoutesData.push(newRoute);
        
        res.status(201).json({
            success: true,
            message: 'Маршрут эвакуации создан успешно',
            data: newRoute
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Ошибка создания маршрута эвакуации'
        });
    }
});

// PUT update evacuation route
router.put('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const index = evacuationRoutesData.findIndex(item => item.id === id);
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                error: 'Маршрут эвакуации не найден'
            });
        }
        
        evacuationRoutesData[index] = Object.assign(evacuationRoutesData[index], req.body, {
            updatedAt: new Date()
        });
        
        res.json({
            success: true,
            message: 'Маршрут эвакуации обновлен успешно',
            data: evacuationRoutesData[index]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Ошибка обновления маршрута эвакуации'
        });
    }
});

// DELETE evacuation route
router.delete('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const index = evacuationRoutesData.findIndex(item => item.id === id);
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                error: 'Маршрут эвакуации не найден'
            });
        }
        
        evacuationRoutesData.splice(index, 1);
        
        res.json({
            success: true,
            message: 'Маршрут эвакуации удален успешно'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Ошибка удаления маршрута эвакуации'
        });
    }
});

// GET evacuation routes statistics
router.get('/stats/overview', (req, res) => {
    try {
        const totalRoutes = evacuationRoutesData.length;
        const activeRoutes = evacuationRoutesData.filter(route => route.status === 'active').length;
        const totalCapacity = evacuationRoutesData.reduce((sum, route) => sum + route.capacity, 0);
        
        const byYear = evacuationRoutesData.reduce((acc, route) => {
            const year = new Date(route.createdAt).getFullYear();
            acc[year] = (acc[year] || 0) + 1;
            return acc;
        }, {});
        
        const byMonth = evacuationRoutesData.reduce((acc, route) => {
            const month = new Date(route.createdAt).getMonth();
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {});
        
        res.json({
            success: true,
            data: {
                totalRoutes,
                activeRoutes,
                totalCapacity,
                byYear,
                byMonth
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Ошибка получения статистики маршрутов эвакуации'
        });
    }
});

module.exports = router;
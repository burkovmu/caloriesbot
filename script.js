// Telegram Web App Integration
let tg = window.Telegram.WebApp;

// Initialize Telegram Web App
if (tg) {
    tg.ready();
    tg.expand();
    
    // Set theme colors
    document.body.classList.add('tg-app');
}

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const mainContent = document.querySelector('.main-content');
    const profileContent = document.querySelector('.profile-content');
    const addFoodContent = document.querySelector('.add-food-content');
    
    // Navigation function
    function switchPage(page) {
        // Remove active class from all nav items
        navItems.forEach(item => item.classList.remove('active'));
        
        // Add active class to clicked item
        event.target.closest('.nav-item').classList.add('active');
        
        // Hide all content sections
        mainContent.style.display = 'none';
        profileContent.style.display = 'none';
        addFoodContent.style.display = 'none';
        
        // Show content based on page
        switch(page) {
            case 'home':
                mainContent.style.display = 'block';
                break;
            case 'add':
                addFoodContent.style.display = 'block';
                break;
            case 'profile':
                profileContent.style.display = 'block';
                break;
            case 'stats':
                // For now, show main content for stats
                mainContent.style.display = 'block';
                break;
        }
    }
    
    // Add click event listeners to nav items
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            switchPage(page);
        });
    });
    
    // Food Analysis Functionality
    const analyzeFoodBtn = document.getElementById('analyzeFood');
    const foodDescription = document.getElementById('foodDescription');
    const analysisResults = document.querySelector('.analysis-results');
    const mealButtons = document.querySelectorAll('.meal-btn');
    const saveMealBtn = document.getElementById('saveMeal');
    
    // Meal type selection
    mealButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            mealButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Analyze food with AI
    if (analyzeFoodBtn) {
        analyzeFoodBtn.addEventListener('click', function() {
            const description = foodDescription.value.trim();
            const selectedMeal = document.querySelector('.meal-btn.active').getAttribute('data-meal');
            
            if (!description) {
                alert('Пожалуйста, опишите что вы съели');
                return;
            }
            
            // Show loading state
            analyzeFoodBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Анализирую...';
            analyzeFoodBtn.disabled = true;
            
            // Simulate AI analysis (replace with real API call)
            setTimeout(() => {
                const analysis = analyzeFoodWithAI(description, selectedMeal);
                displayAnalysisResults(analysis);
                
                // Reset button
                analyzeFoodBtn.innerHTML = '<i class="fas fa-brain"></i> Анализировать с ИИ';
                analyzeFoodBtn.disabled = false;
            }, 2000);
        });
    }
    
    // Save meal functionality
    if (saveMealBtn) {
        saveMealBtn.addEventListener('click', function() {
            const mealType = document.querySelector('.meal-btn.active').getAttribute('data-meal');
            const description = foodDescription.value;
            
            // Save meal to local storage (replace with real database)
            saveMeal(mealType, description);
            
            // Show success message
            alert('Прием пищи сохранен!');
            
            // Reset form
            foodDescription.value = '';
            analysisResults.style.display = 'none';
            
            // Update today's meals
            updateTodayMeals();
        });
    }
    
    // Profile edit functionality
    const profileEdit = document.querySelector('.profile-edit');
    if (profileEdit) {
        profileEdit.addEventListener('click', function() {
            alert('Функция редактирования профиля будет добавлена позже');
        });
    }
    
    // Settings items functionality
    const settingItems = document.querySelectorAll('.setting-item');
    settingItems.forEach(item => {
        item.addEventListener('click', function() {
            const settingTitle = this.querySelector('h4').textContent;
            alert(`Настройка "${settingTitle}" будет добавлена позже`);
        });
    });
    
    // Button functionality
    const btnSecondary = document.querySelectorAll('.btn-secondary');
    btnSecondary.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            alert(`Функция "${action}" будет добавлена позже`);
        });
    });
    
    const btnDanger = document.querySelector('.btn-danger');
    if (btnDanger) {
        btnDanger.addEventListener('click', function() {
            if (confirm('Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.')) {
                alert('Аккаунт будет удален');
            }
        });
    }
    
    // Action cards functionality
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('click', function() {
            const action = this.querySelector('h3').textContent;
            if (action === 'Добавить еду') {
                switchPage('add');
            } else {
                alert(`Функция "${action}" будет добавлена позже`);
            }
        });
    });
});

// AI Food Analysis Function (Simulation)
function analyzeFoodWithAI(description, mealType) {
    // This would be replaced with real ChatGPT API call
    const foods = description.toLowerCase().split(',');
    let totalCalories = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;
    
    // Simple food analysis (replace with real AI)
    foods.forEach(food => {
        const foodItem = food.trim();
        if (foodItem.includes('куриц') || foodItem.includes('грудк')) {
            totalCalories += 165;
            totalProtein += 31;
            totalFat += 3.6;
            totalCarbs += 0;
        } else if (foodItem.includes('рис')) {
            totalCalories += 130;
            totalProtein += 2.7;
            totalFat += 0.3;
            totalCarbs += 28;
        } else if (foodItem.includes('овощ') || foodItem.includes('салат')) {
            totalCalories += 25;
            totalProtein += 1.2;
            totalFat += 0.2;
            totalCarbs += 5;
        } else if (foodItem.includes('яйц')) {
            totalCalories += 70;
            totalProtein += 6;
            totalFat += 5;
            totalCarbs += 1;
        } else if (foodItem.includes('молок') || foodItem.includes('йогурт')) {
            totalCalories += 60;
            totalProtein += 3.2;
            totalFat += 3.3;
            totalCarbs += 4.8;
        } else {
            // Default values for unknown foods
            totalCalories += 100;
            totalProtein += 5;
            totalFat += 3;
            totalCarbs += 15;
        }
    });
    
    // Generate AI recommendations
    let recommendations = '';
    if (totalCalories < 200) {
        recommendations = 'Это легкий прием пищи. Рекомендую добавить больше белка для насыщения.';
    } else if (totalCalories > 600) {
        recommendations = 'Это довольно калорийный прием пищи. Учитывайте это в общем дневном балансе.';
    } else {
        recommendations = 'Хорошо сбалансированный прием пищи. Продолжайте в том же духе!';
    }
    
    if (totalProtein < 15) {
        recommendations += ' Рекомендую добавить больше белковых продуктов.';
    }
    
    return {
        calories: totalCalories,
        protein: totalProtein,
        fat: totalFat,
        carbs: totalCarbs,
        recommendations: recommendations
    };
}

// Display analysis results
function displayAnalysisResults(analysis) {
    const analysisResults = document.querySelector('.analysis-results');
    const nutritionValues = document.querySelectorAll('.nutrition-value');
    const recommendationText = document.querySelector('.recommendation-text p');
    
    // Update nutrition values
    nutritionValues[0].textContent = `${analysis.calories} ккал`;
    nutritionValues[1].textContent = `${analysis.protein}г`;
    nutritionValues[2].textContent = `${analysis.fat}г`;
    nutritionValues[3].textContent = `${analysis.carbs}г`;
    
    // Update recommendations
    recommendationText.textContent = analysis.recommendations;
    
    // Show results
    analysisResults.style.display = 'block';
    
    // Scroll to results
    analysisResults.scrollIntoView({ behavior: 'smooth' });
}

// Save meal to storage
function saveMeal(mealType, description) {
    const meals = JSON.parse(localStorage.getItem('meals') || '[]');
    const today = new Date().toDateString();
    
    const meal = {
        id: Date.now(),
        type: mealType,
        description: description,
        date: today,
        timestamp: new Date().toISOString()
    };
    
    meals.push(meal);
    localStorage.setItem('meals', JSON.stringify(meals));
}

// Update today's meals display
function updateTodayMeals() {
    const meals = JSON.parse(localStorage.getItem('meals') || '[]');
    const today = new Date().toDateString();
    const todayMeals = meals.filter(meal => meal.date === today);
    
    const mealItems = document.querySelectorAll('.meal-item');
    const mealTypes = ['breakfast', 'lunch', 'dinner'];
    
    mealItems.forEach((item, index) => {
        const mealType = mealTypes[index];
        const mealContent = item.querySelector('.meal-content p');
        const mealCalories = item.querySelector('.meal-calories span');
        
        const typeMeals = todayMeals.filter(meal => meal.type === mealType);
        
        if (typeMeals.length > 0) {
            mealContent.textContent = typeMeals.map(meal => meal.description).join(', ');
            // Calculate calories (simplified)
            mealCalories.textContent = `${typeMeals.length * 250} ккал`;
        } else {
            mealContent.textContent = 'Пока нет записей';
            mealCalories.textContent = '0 ккал';
        }
    });
}

// Progress bar animation
function updateProgress(percentage) {
    const progressFill = document.querySelector('.progress-fill');
    const progressPercentage = document.querySelector('.progress-percentage');
    const progressStats = document.querySelector('.progress-stats span');
    
    if (progressFill && progressPercentage && progressStats) {
        progressFill.style.width = percentage + '%';
        progressPercentage.textContent = percentage + '%';
        
        const currentCalories = Math.round((percentage / 100) * 2000);
        progressStats.textContent = `${currentCalories} / 2000 ккал`;
    }
}

// Simulate progress update (for demo purposes)
setTimeout(() => {
    updateProgress(25);
}, 1000);

// Stats update functionality
function updateStats() {
    // This would be connected to real data in a real app
    const stats = {
        calories: Math.floor(Math.random() * 500) + 100,
        target: 2000,
        streak: Math.floor(Math.random() * 10) + 1,
        accuracy: Math.floor(Math.random() * 20) + 80
    };
    
    // Update main stats
    const statValues = document.querySelectorAll('.stat-content h3');
    if (statValues.length >= 2) {
        statValues[0].textContent = stats.calories;
        statValues[1].textContent = stats.target;
    }
    
    // Update personal stats if on profile page
    const personalStatValues = document.querySelectorAll('.personal-stats .stat-content h3');
    if (personalStatValues.length >= 4) {
        personalStatValues[0].textContent = stats.streak;
        personalStatValues[1].textContent = stats.accuracy + '%';
    }
}

// Update stats every 5 seconds (for demo)
setInterval(updateStats, 5000);

// Welcome message based on time of day
function updateWelcomeMessage() {
    const hour = new Date().getHours();
    const welcomeTitle = document.querySelector('.welcome-card h1');
    
    if (welcomeTitle) {
        if (hour < 12) {
            welcomeTitle.textContent = 'Доброе утро!';
        } else if (hour < 18) {
            welcomeTitle.textContent = 'Добрый день!';
        } else {
            welcomeTitle.textContent = 'Добрый вечер!';
        }
    }
}

// Update welcome message on load
updateWelcomeMessage();

// Initialize meals display
document.addEventListener('DOMContentLoaded', function() {
    updateTodayMeals();
});

// Show notification to user
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        font-weight: 600;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Handle Telegram Web App events
if (tg) {
    // Handle main button click
    tg.MainButton.onClick(function() {
        console.log('Main button clicked');
        showNotification('Функция добавления еды будет доступна в следующем обновлении');
    });
    
    // Handle back button click
    tg.BackButton.onClick(function() {
        console.log('Back button clicked');
        tg.close();
    });
}

// Add some interactive animations
function addHoverEffects() {
    const cards = document.querySelectorAll('.stat-card, .action-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.01)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Initialize hover effects
document.addEventListener('DOMContentLoaded', function() {
    addHoverEffects();
});

// Add smooth scrolling for better UX
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Handle theme changes (if Telegram supports it)
if (tg && tg.themeParams) {
    function updateTheme() {
        const theme = tg.themeParams;
        
        // Update colors based on Telegram theme
        if (theme.bg_color) {
            document.documentElement.style.setProperty('--tg-bg-color', theme.bg_color);
        }
        
        if (theme.text_color) {
            document.documentElement.style.setProperty('--tg-text-color', theme.text_color);
        }
        
        if (theme.hint_color) {
            document.documentElement.style.setProperty('--tg-hint-color', theme.hint_color);
        }
        
        if (theme.link_color) {
            document.documentElement.style.setProperty('--tg-link-color', theme.link_color);
        }
        
        if (theme.button_color) {
            document.documentElement.style.setProperty('--tg-button-color', theme.button_color);
        }
        
        if (theme.button_text_color) {
            document.documentElement.style.setProperty('--tg-button-text-color', theme.button_text_color);
        }
    }
    
    // Update theme on load
    updateTheme();
    
    // Listen for theme changes
    tg.onEvent('themeChanged', updateTheme);
}

// Add loading animation
function showLoading() {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = `
        <div class="loading-spinner"></div>
        <p style="color: #2c3e50; font-size: 14px; font-weight: 500;">Загрузка...</p>
    `;
    
    loading.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.95);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    
    document.body.appendChild(loading);
    
    // Remove loading after 2 seconds
    setTimeout(() => {
        if (loading.parentNode) {
            loading.parentNode.removeChild(loading);
        }
    }, 2000);
}

// Show loading on page load
window.addEventListener('load', function() {
    // Small delay to show loading animation
    setTimeout(() => {
        showLoading();
    }, 100);
});

console.log('CalorieTracker Mini App loaded successfully!'); 
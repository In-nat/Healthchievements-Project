/* =============================================================
   HEALTHCHIEVEMENTS — PERSONALISED HEALTH TIPS (health-tips.js)
   =============================================================
   This file contains ALL the logic for generating health tips 
   based on the user's data. It's used by tips.html.

   HOW IT WORKS:
   1. We read the user's saved health data from localStorage
   2. We look at their BMI, sleep, heart rate, and cycle data
   3. We generate specific tips based on their actual numbers
   4. We also have a list of general tips for everyone
   5. We build the HTML and insert it into the page

   WHAT'S IN THIS FILE:
   - generatePersonalTips()  → Creates tips based on user data
   - generalTips[]            → Array of tips for everyone
   - loadTips()               → Builds the full page content
   ============================================================= */


// =============================================
// PERSONALISED TIP GENERATOR
// =============================================
// This function looks at the user's stored health data
// and creates an array of tip objects that are SPECIFIC
// to their numbers. This is the "smart" part!
//
// PARAMETERS:
//   questLog — an array of health data objects from localStorage
//
// RETURNS:
//   an array of tip objects, each with:
//     - type: 'good', 'warning', 'alert', or 'info' (used for styling)
//     - icon: an emoji to display
//     - title: the tip's headline
//     - body: the detailed tip text

function generatePersonalTips(questLog) {
    var tips = []; // We'll build an array of tip objects

    // If there's no data, return empty — no personal tips possible
    if (questLog.length === 0) {
        return tips;
    }

    // --- Get the LATEST entry (last item in the array) ---
    var latest = questLog[questLog.length - 1];

    // --- Calculate averages across ALL entries ---
    var totalSleep = 0;
    var sleepCount = 0;
    var totalHR = 0;
    var hrCount = 0;

    // Loop through every entry to add up values
    for (var i = 0; i < questLog.length; i++) {
        if (questLog[i].sleepHours) {
            totalSleep += parseFloat(questLog[i].sleepHours);
            sleepCount++;
        }
        if (questLog[i].heartRate) {
            totalHR += parseFloat(questLog[i].heartRate);
            hrCount++;
        }
    }

    // Calculate the averages (avoid dividing by zero!)
    var avgSleep = sleepCount > 0 ? totalSleep / sleepCount : null;
    var avgHR = hrCount > 0 ? totalHR / hrCount : null;


    // ===== BMI TIPS =====
    // BMI (Body Mass Index) tells us about weight relative to height.
    // We check the latest BMI value and give specific advice.
    if (latest.bmi && latest.bmi !== '--') {
        var bmi = parseFloat(latest.bmi);

        if (bmi < 18.5) {
            // Underweight
            tips.push({
                type: 'warning',
                icon: '🍎',
                title: 'Nutrition Power-Up Needed!',
                body: 'Your BMI (' + bmi + ') shows you might be underweight. Try adding more nutrient-rich foods to your daily rations — think nuts, avocados, whole grains, and lean proteins. Small, frequent meals can help you gain healthy weight. Consider consulting a healer (doctor) for a personalised nutrition quest!'
            });
        } else if (bmi >= 18.5 && bmi < 25) {
            // Normal / Healthy range
            tips.push({
                type: 'good',
                icon: '🏆',
                title: 'BMI — Perfectly Balanced!',
                body: 'Amazing work, hero! Your BMI (' + bmi + ') is in the healthy range. Keep up your current eating and exercise habits to maintain this awesome stat. You\'ve unlocked the "Balance Master" achievement in our hearts!'
            });
        } else if (bmi >= 25 && bmi < 30) {
            // Overweight
            tips.push({
                type: 'warning',
                icon: '🏃',
                title: 'Training Montage Recommended!',
                body: 'Your BMI (' + bmi + ') is slightly above the healthy range. Time for a training montage! Try adding 30 minutes of movement to your daily routine — walking, swimming, cycling, or dancing all count. Small changes to portion sizes can also make a big difference on this quest.'
            });
        } else {
            // Obese
            tips.push({
                type: 'alert',
                icon: '⚠️',
                title: 'Critical Quest: Weight Management',
                body: 'Your BMI (' + bmi + ') is in the obese range. This is a tough boss battle, but you can win! Start with small goals — even a 5% weight reduction brings huge health bonuses. Please consider visiting a healer (doctor) who can create a personalised strategy for your journey.'
            });
        }
    }


    // ===== SLEEP TIPS =====
    // Adults need 7-9 hours of sleep for optimal health.
    // We check their average sleep and give specific advice.
    if (avgSleep !== null) {
        if (avgSleep < 6) {
            // Severely under-sleeping
            tips.push({
                type: 'alert',
                icon: '😴',
                title: 'Critical! Sleep HP is Low!',
                body: 'You\'re averaging only ' + avgSleep.toFixed(1) + ' hours of sleep. Your character needs 7-9 hours to fully regenerate! Poor sleep weakens your immune defence, slows down XP gain, and makes boss fights (daily challenges) much harder. Try setting a "lights out" alarm 8 hours before you need to wake up.'
            });
        } else if (avgSleep < 7) {
            // Slightly under recommended
            tips.push({
                type: 'warning',
                icon: '🛌',
                title: 'Sleep Buff Almost There!',
                body: 'You\'re getting ' + avgSleep.toFixed(1) + ' hours on average — close to the recommended 7-9 hours! Try going to bed just 30 minutes earlier. Avoid screen time (the blue light debuff!) before bed, and keep your sleeping chamber cool and dark for maximum rest bonus.'
            });
        } else if (avgSleep <= 9) {
            // Perfect range!
            tips.push({
                type: 'good',
                icon: '✨',
                title: 'Sleep Master Achievement!',
                body: 'Excellent! You\'re averaging ' + avgSleep.toFixed(1) + ' hours of sleep — right in the sweet spot! Quality rest gives you bonus HP regeneration, better focus stats, and stronger immune defence. Keep this up, champion!'
            });
        } else {
            // Oversleeping
            tips.push({
                type: 'warning',
                icon: '⏰',
                title: 'Oversleep Warning!',
                body: 'You\'re averaging ' + avgSleep.toFixed(1) + ' hours — that\'s more than the recommended 7-9 hours. Too much sleep can actually lower your energy stats! If you\'re feeling constantly tired despite long rest, consider checking with a healer, as it might signal an underlying debuff.'
            });
        }
    }


    // ===== HEART RATE TIPS =====
    // Normal resting heart rate for adults: 60-100 bpm
    // Lower can mean great fitness, higher can mean stress/issues
    if (avgHR !== null) {
        var hr = Math.round(avgHR);

        if (hr < 60) {
            // Low — could be athletic or a concern
            tips.push({
                type: 'info',
                icon: '💓',
                title: 'Low Resting Heart Rate',
                body: 'Your average heart rate is ' + hr + ' bpm. If you\'re athletic, this could be a sign of great cardiovascular fitness — an S-tier passive ability! However, if you\'re not very active or feel dizzy/tired, it\'s worth mentioning to your healer (doctor).'
            });
        } else if (hr <= 100) {
            // Normal — great!
            tips.push({
                type: 'good',
                icon: '💚',
                title: 'Heart Rate — Optimal Zone!',
                body: 'Your average heart rate of ' + hr + ' bpm is in the normal resting range (60-100 bpm). Your heart is performing well! Regular cardio exercise (the "Endurance Training" side quest) can help keep it even stronger.'
            });
        } else {
            // High — needs attention
            tips.push({
                type: 'alert',
                icon: '❤️‍🔥',
                title: 'Heart Rate Running High!',
                body: 'Your average heart rate is ' + hr + ' bpm, which is above the normal resting range. Stress, caffeine, and lack of exercise can cause this. Try deep breathing exercises (the "Meditation" skill), reduce caffeine potions, and add light exercise to your daily routine. If it stays high, please visit a healer!'
            });
        }
    }


    // ===== MENSTRUAL CYCLE TIPS =====
    // If the user has cycle tracking enabled, give relevant advice
    if (latest.cycleTracking) {
        tips.push({
            type: 'info',
            icon: '🌸',
            title: 'Cycle Tracking Active!',
            body: 'Great job tracking your cycle! Regular tracking helps you understand your body\'s patterns and predict changes in energy, mood, and physical performance. During your period, your iron levels may drop — combat this with iron-rich foods like spinach, red meat, or fortified cereals (HP restoration items!).'
        });

        // Check if cycle length is outside normal range (21-35 days)
        if (latest.cycleLength && (latest.cycleLength < 21 || latest.cycleLength > 35)) {
            tips.push({
                type: 'warning',
                icon: '📊',
                title: 'Cycle Length — Worth Checking',
                body: 'Your recorded cycle length of ' + latest.cycleLength + ' days is outside the typical 21-35 day range. This isn\'t always a problem (everyone\'s different!), but if it\'s consistently irregular, it\'s a good idea to chat with a healer (doctor) about it. They can check for any hidden debuffs.'
            });
        }
    }


    // ===== CONSISTENCY TIP =====
    // Reward the user for logging multiple entries
    if (questLog.length >= 3) {
        tips.push({
            type: 'good',
            icon: '🔥',
            title: 'Streak Bonus Active!',
            body: 'You\'ve logged ' + questLog.length + ' quests so far — consistency is the most powerful buff in the game! Regular tracking helps you spot trends, catch problems early, and see your progress over time. Keep logging to unlock more achievements!'
        });
    }

    return tips;
}


// =============================================
// GENERAL TIPS (shown to everyone regardless of data)
// =============================================
// These are always displayed and don't depend on the user's numbers.
var generalTips = [
    {
        icon: '💧',
        title: 'Hydration Potion',
        body: 'Drink at least 8 glasses of water daily. Dehydration is a sneaky debuff that lowers energy, focus, and physical performance!'
    },
    {
        icon: '🥦',
        title: 'Eat the Rainbow',
        body: 'Fill your plate with colourful fruits and vegetables. Each colour gives different stat boosts — vitamins, minerals, and antioxidants!'
    },
    {
        icon: '🚶',
        title: '10K Steps Quest',
        body: 'Aim for 10,000 steps a day. Walking is the easiest grind in the game — it boosts mood, burns calories, and strengthens your heart.'
    },
    {
        icon: '🧘',
        title: 'Meditation Skill',
        body: 'Even 5 minutes of deep breathing or mindfulness can reduce stress, improve focus, and lower your heart rate. A powerful passive ability!'
    },
    {
        icon: '📵',
        title: 'Screen Break Buff',
        body: 'Every 20 minutes, look at something 20 feet away for 20 seconds (the 20-20-20 rule). Protects your eye stats from screen damage!'
    },
    {
        icon: '🏋️',
        title: 'Strength Training',
        body: 'Include strength exercises 2-3 times per week. Building muscle boosts metabolism, protects joints, and increases your base power stat!'
    }
];


// =============================================
// BUILD THE TIPS PAGE
// =============================================
// This function is called when tips.html loads.
// It reads the user's data, generates personal tips,
// and builds all the HTML content for the page.
function loadTips() {
    // Find the container where we'll put our content
    var container = document.getElementById('tipsContent');

    // Read health data from localStorage
    var data = localStorage.getItem('healthQuestLog');
    var questLog = data ? JSON.parse(data) : [];

    var html = '';

    // --- SECTION 1: Personal Tips ---
    var personalTips = generatePersonalTips(questLog);

    if (personalTips.length > 0) {
        html += '<h2 class="tip-section-title">⚡ Your Personal Power-Ups</h2>';

        // Loop through each personal tip and create a card
        for (var i = 0; i < personalTips.length; i++) {
            var tip = personalTips[i];
            html += '<div class="tip-card ' + tip.type + '">';
            html += '  <div class="tip-header">';
            html += '    <span class="tip-icon">' + tip.icon + '</span>';
            html += '    <span class="tip-title">' + tip.title + '</span>';
            html += '    <span class="tip-badge badge-personal">⚡ Personal</span>';
            html += '  </div>';
            html += '  <div class="tip-body">' + tip.body + '</div>';
            html += '</div>';
        }
    } else {
        // No data yet — show a friendly message
        html += '<div class="empty-state" style="margin-bottom: 30px;">';
        html += '  <div style="font-size: 40px; margin-bottom: 10px;">⚡</div>';
        html += '  <h2>No Personal Tips Yet!</h2>';
        html += '  <p style="color: var(--text-muted);">';
        html += '    Log your first health quest to get personalised power-up tips based on YOUR stats!';
        html += '  </p>';
        html += '  <a href="log.html">📝 Log Your First Quest</a>';
        html += '</div>';
    }

    // --- SECTION 2: General Tips (for everyone) ---
    html += '<h2 class="tip-section-title">📚 General Power-Up Guide</h2>';
    html += '<div class="general-tips-grid">';

    for (var g = 0; g < generalTips.length; g++) {
        var gt = generalTips[g];
        html += '<div class="general-tip">';
        html += '  <div class="gt-icon">' + gt.icon + '</div>';
        html += '  <div class="gt-title">' + gt.title + '</div>';
        html += '  <div class="gt-body">' + gt.body + '</div>';
        html += '</div>';
    }

    html += '</div>';

    // --- SECTION 3: Link to real doctors ---
    html += '<h2 class="tip-section-title">🏥 Need a Real Healer?</h2>';
    html += '<div class="tip-card info">';
    html += '  <div class="tip-header">';
    html += '    <span class="tip-icon">🩺</span>';
    html += '    <span class="tip-title">Visit the Healer\'s Guild</span>';
    html += '  </div>';
    html += '  <div class="tip-body">';
    html += '    These tips are general guidance — for personalised medical advice, always consult a professional healer (doctor)! ';
    html += '    Visit our alliance partners: ';
    html += '    <a href="https://www.healthdirect.gov.au/australian-health-services" target="_blank" style="color: var(--secondary);">Health Direct</a> or ';
    html += '    <a href="https://www.nationaltelemedicinedoctors.com/" target="_blank" style="color: var(--secondary);">National Telemedicine Doctors</a>.';
    html += '  </div>';
    html += '</div>';

    // Put all the HTML into the page
    container.innerHTML = html;
}


// =============================================
// AUTO-RUN: Load tips when the page finishes loading
// =============================================
// This waits for the page to be fully loaded before running.
// It's like waiting for the game to finish loading before playing!
document.addEventListener('DOMContentLoaded', function() {
    loadTips();
});

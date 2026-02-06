document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const elements = {
        analogClock: document.getElementById('analogClock'),
        digitalClock: document.getElementById('digitalClock'),
        hourHand: document.getElementById('hourHand'),
        minuteHand: document.getElementById('minuteHand'),
        secondHand: document.getElementById('secondHand'),
        digitalTime: document.getElementById('digitalTime'),
        amPm: document.getElementById('amPm'),
        digitalDate: document.getElementById('digitalDate'),
        viewToggle: document.getElementById('viewToggle'),
        toggleText: document.querySelector('.toggle-text'),
        aiMessage: document.getElementById('aiMessage'),
        // Weather
        weatherContainer: document.getElementById('weatherContainer'),
        weatherLoading: document.querySelector('.weather-loading'),
        weatherContent: document.querySelector('.weather-content'),
        weatherIcon: document.getElementById('weatherIcon'),
        temperature: document.getElementById('temperature'),
        weatherDesc: document.getElementById('weatherDesc'),
        locationName: document.getElementById('locationName'),
        // Extras
        fortuneBtn: document.getElementById('fortuneBtn'),
        fortuneResult: document.getElementById('fortuneResult'),
        fortuneRank: document.getElementById('fortuneRank'),
        fortuneText: document.getElementById('fortuneText'),
        stressValue: document.getElementById('stressValue'),
        stressBar: document.getElementById('stressBar'),
        stressMsg: document.getElementById('stressMsg')
    };

    let isDigitalMode = false;
    let stressLevel = 0;
    let movementAccumulator = 0;
    let clickAccumulator = 0;

    // AI Messages Configuration
    // AI Messages Configuration
    // Structure: Time -> Stress Level -> Messages
    const messages = {
        morning: {
            relaxed: [ // Stress < 30
                "おはようございます。最高の目覚めですね！",
                "朝の光が心地よいですね。準備は万端ですか？",
                "穏やかな朝です。紅茶でもいかがですか。"
            ],
            normal: [ // Stress 30-70
                "おはようございます。今日も一日頑張りましょう。",
                "新しい一日の始まりです。深呼吸してスタート。",
                "朝ご飯はしっかり食べましたか？"
            ],
            stressed: [ // Stress > 70
                "おはようございます。少し焦っていませんか？深呼吸。",
                "無理は禁物です。まずは一杯の水を。",
                "大丈夫、一つ一つ片付けていきましょう。"
            ]
        },
        day: {
            relaxed: [
                "順調ですね！この調子でいきましょう。",
                "良い天気ですね（比喩）。気分も晴れやかですか？",
                "余裕を感じます。新しいアイデアが浮かぶかも。"
            ],
            normal: [
                "こんにちは。順調に進んでいますか？",
                "水分補給を忘れずに。リフレッシュも大切です。",
                "午後の予定も確認しておきましょう。"
            ],
            stressed: [
                "根詰めすぎていませんか？少し窓の外を見てみましょう。",
                "肩の力を抜いて。5分だけ休憩しませんか？",
                "一度立ち上がって伸びをしましょう。リセットが大切。"
            ]
        },
        evening: {
            relaxed: [
                "良い夕暮れ時ですね。ゆったりした時間を。",
                "充実した一日でしたか？お疲れ様です。",
                "このまま穏やかに夜を迎えましょう。"
            ],
            normal: [
                "お疲れ様でした。そろそろリラックスしませんか？",
                "今日も一日よく頑張りましたね。",
                "夕食は何にしましょうか？"
            ],
            stressed: [
                "本当にお疲れ様です。今日は早めに切り上げませんか？",
                "頭を空っぽにする時間が必要です。",
                "頑張りすぎです。自分を甘やかしてください。"
            ]
        },
        night: {
            relaxed: [
                "静かな夜ですね。良い夢が見られそうです。",
                "リラックスタイムを楽しんでください。",
                "今日もお疲れ様でした。明日も良い日でありますように。"
            ],
            normal: [
                "こんばんは。明日へのエネルギーをチャージしましょう。",
                "夜更かしはほどほどに。良い夢を。",
                "今日という日に感謝を。"
            ],
            stressed: [
                "考え事は明日にして、今は休みましょう。",
                "温かい飲み物を飲んで、リラックスしてください。",
                "眠れそうですか？目を閉じて深呼吸を。"
            ]
        },
        midnight: {
            relaxed: [
                "まだ起きていますか？静寂を楽しんでいますね。",
                "世界が眠っている間の、あなただけの時間です。",
                "夜更かしもたまには良いですね。"
            ],
            normal: [
                "深夜の時間帯です。無理せず休んでくださいね。",
                "そろそろベッドへ向かう時間かもしれません。",
                "暖かくして休んでください。"
            ],
            stressed: [
                "眠れない夜ですか？無理に寝ようとしなくても大丈夫。",
                "画面から目を離して、遠くを見てみましょう。",
                "全てを忘れて、今は身体を休めることだけ考えて。"
            ]
        }
    };

    /**
     * Message Logic
     */
    function updateMessage() {
        const hour = new Date().getHours();
        let periodKey = 'day';

        if (hour >= 5 && hour < 11) periodKey = 'morning';
        else if (hour >= 11 && hour < 17) periodKey = 'day';
        else if (hour >= 17 && hour < 20) periodKey = 'evening';
        else if (hour >= 20) periodKey = 'night';
        else periodKey = 'midnight';

        // Determine Stress Category
        let stressKey = 'normal';
        if (stressLevel < 30) stressKey = 'relaxed';
        else if (stressLevel > 70) stressKey = 'stressed';

        const possibleMessages = messages[periodKey][stressKey];
        const newMessage = possibleMessages[Math.floor(Math.random() * possibleMessages.length)];

        // Update if distinct or force update periodically
        // We'll trust the caller interval, but also can update when stress shifts significantly?
        // For now, simple poll update.
        if (elements.aiMessage.textContent !== newMessage) {
            elements.aiMessage.textContent = newMessage;

            // Re-trigger typing animation
            elements.aiMessage.classList.remove('typing-effect');
            void elements.aiMessage.offsetWidth;
            elements.aiMessage.classList.add('typing-effect');
        }
    }

    // Fortune Data
    const fortunes = [
        { rank: "大吉", text: "最高の一日！新しいことに挑戦してみて。", color: "#ffd700" },
        { rank: "中吉", text: "良いことがありそう。笑顔を大切に。", color: "#c0c0c0" },
        { rank: "小吉", text: "些細な幸せが見つかる予感。", color: "#cd7f32" },
        { rank: "吉", text: "堅実な一日。いつも通りが一番。", color: "#a0a0b0" },
        { rank: "凶", text: "慎重に行動しましょう。深呼吸を忘れずに。", color: "#ff6b6b" },
        { rank: "大凶", text: "無理は禁物。自分をいたわってください。", color: "#ff4d4d" }
    ];

    /**
     * WMO Weather Codes
     */
    function getWeatherInfo(code) {
        if (code === 0) return { icon: "☀", text: "快晴" };
        if (code === 1) return { icon: "🌤", text: "晴れ" };
        if (code === 2) return { icon: "⛅", text: "曇り時々晴れ" };
        if (code === 3) return { icon: "☁", text: "曇り" };
        if ([45, 48].includes(code)) return { icon: "🌫", text: "霧" };
        if ([51, 53, 55].includes(code)) return { icon: "🌦", text: "霧雨" };
        if ([61, 63, 65].includes(code)) return { icon: "🌧", text: "雨" };
        if ([66, 67].includes(code)) return { icon: "🌨", text: "氷雨" };
        if ([71, 73, 75].includes(code)) return { icon: "❄", text: "雪" };
        if ([77].includes(code)) return { icon: "❄", text: "あられ" };
        if ([80, 81, 82].includes(code)) return { icon: "⛈", text: "にわか雨" };
        if ([85, 86].includes(code)) return { icon: "❄", text: "にわか雪" };
        if ([95, 96, 99].includes(code)) return { icon: "🌩", text: "雷雨" };
        return { icon: "❓", text: "不明" };
    }

    /**
     * Updates the clock
     */
    function updateClock() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        // Analog
        const secondDeg = ((seconds / 60) * 360);
        const minuteDeg = ((minutes / 60) * 360) + ((seconds / 60) * 6);
        const hourDeg = ((hours / 12) * 360) + ((minutes / 60) * 30);

        elements.secondHand.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
        elements.minuteHand.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
        elements.hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;

        // Digital
        const ampmStr = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const formattedTime = `${pad(displayHours)}:${pad(minutes)}:${pad(seconds)}`;

        elements.digitalTime.textContent = formattedTime;
        elements.amPm.textContent = ampmStr;

        // Date
        const year = now.getFullYear();
        const month = pad(now.getMonth() + 1);
        const day = pad(now.getDate());
        const weekDay = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][now.getDay()];
        elements.digitalDate.textContent = `${year}.${month}.${day} ${weekDay}`;
    }

    function pad(num) {
        return num.toString().padStart(2, '0');
    }

    /**
     * Message Logic
     */
    function updateMessage() {
        const hour = new Date().getHours();
        let periodKey = 'day';

        if (hour >= 5 && hour < 11) periodKey = 'morning';
        else if (hour >= 11 && hour < 17) periodKey = 'day';
        else if (hour >= 17 && hour < 20) periodKey = 'evening';
        else if (hour >= 20) periodKey = 'night';
        else periodKey = 'midnight';

        const possibleMessages = messages[periodKey];
        const newMessage = possibleMessages[Math.floor(Math.random() * possibleMessages.length)];

        if (!elements.aiMessage.getAttribute('data-set')) {
            elements.aiMessage.textContent = newMessage;
            elements.aiMessage.setAttribute('data-set', 'true');
        }
    }

    /**
     * View Toggle
     */
    function toggleView() {
        isDigitalMode = !isDigitalMode;
        if (isDigitalMode) {
            elements.analogClock.classList.remove('active');
            setTimeout(() => elements.digitalClock.classList.add('active'), 300);
            elements.toggleText.textContent = "Analog Mode";
        } else {
            elements.digitalClock.classList.remove('active');
            setTimeout(() => elements.analogClock.classList.add('active'), 300);
            elements.toggleText.textContent = "Digital Mode";
        }
    }

    /**
     * Weather
     */
    function initWeather() {
        if (!navigator.geolocation) {
            showWeatherError("Geolocation disabled");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                try {
                    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
                    const weatherRes = await fetch(weatherUrl);
                    const weatherData = await weatherRes.json();

                    if (weatherData.current_weather) {
                        const { temperature, weathercode } = weatherData.current_weather;
                        const info = getWeatherInfo(weathercode);
                        elements.temperature.textContent = `${Math.round(temperature)}°C`;
                        elements.weatherIcon.textContent = info.icon;
                        elements.weatherDesc.textContent = info.text;
                    }

                    try {
                        const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
                        const geoRes = await fetch(geoUrl, { headers: { 'User-Agent': 'ChronoPlanetoid/1.0' } });
                        const geoData = await geoRes.json();
                        let location = "Unknown";
                        if (geoData.address) {
                            location = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.state || "現在地";
                        }
                        elements.locationName.textContent = location;
                    } catch (e) {
                        elements.locationName.textContent = `Lat:${lat.toFixed(1)}, Lon:${lon.toFixed(1)}`;
                    }

                    elements.weatherLoading.style.display = 'none';
                    elements.weatherContent.classList.remove('hidden');
                } catch (error) {
                    showWeatherError("Weather unavailable");
                }
            },
            (error) => showWeatherError("位置情報許可待ち")
        );
    }

    function showWeatherError(msg) {
        elements.weatherLoading.textContent = msg;
    }

    /**
     * Fortune Teller
     */
    function drawFortune() {
        elements.fortuneBtn.style.display = 'none';
        elements.fortuneResult.classList.remove('hidden');

        const result = fortunes[Math.floor(Math.random() * fortunes.length)];
        elements.fortuneRank.textContent = result.rank;
        elements.fortuneRank.style.color = result.color;
        elements.fortuneText.textContent = result.text;
    }

    /**
     * Stress Meter Logic
     */
    function updateStress() {
        // Pseudo stress calculation
        // High movement + lots of clicks = High stress
        // Decay over time
        const decay = 2;
        const moveImpact = 0.05;
        const clickImpact = 5;

        let addedStress = (movementAccumulator * moveImpact) + (clickAccumulator * clickImpact);
        stressLevel = Math.min(100, Math.max(0, stressLevel + addedStress - decay));

        // Reset accumulators
        movementAccumulator = 0;
        clickAccumulator = 0;

        // UI Update
        elements.stressValue.textContent = `${Math.round(stressLevel)}%`;
        elements.stressBar.style.width = `${stressLevel}%`;

        let msg = "リラックスしています";
        if (stressLevel > 80) msg = "深呼吸しましょう…！";
        else if (stressLevel > 50) msg = "少し休憩しませんか？";
        else if (stressLevel > 20) msg = "集中しているようです";

        elements.stressMsg.textContent = msg;
    }

    // Input Tracking
    document.addEventListener('mousemove', (e) => {
        const dx = e.movementX;
        const dy = e.movementY;
        movementAccumulator += Math.sqrt(dx * dx + dy * dy);
    });

    document.addEventListener('click', () => {
        clickAccumulator++;
    });

    // Listeners
    elements.viewToggle.addEventListener('click', toggleView);
    elements.fortuneBtn.addEventListener('click', drawFortune);

    // Loops
    setInterval(updateClock, 1000);
    setInterval(updateMessage, 1000 * 60 * 60);
    setInterval(initWeather, 1000 * 60 * 30);
    setInterval(updateStress, 500);
    setInterval(updateThemeColor, 1000 * 60); // Check color every minute

    // Initial Calls
    updateClock();
    updateThemeColor();
    updateMessage();
    initWeather();

    /**
     * Dynamic Theme Color Logic
     */
    function updateThemeColor() {
        const hour = new Date().getHours();
        const root = document.documentElement;
        let accentColor, glowColor, secondaryColor;

        // Morning (5-10): Cyan/Green (Fresh)
        if (hour >= 5 && hour < 11) {
            accentColor = '#00f3ff'; // Cyan
            secondaryColor = '#00ff9d'; // Spring Green
        }
        // Day (11-16): Orange/Yellow (Bright)
        else if (hour >= 11 && hour < 17) {
            accentColor = '#ffaa00'; // Orange
            secondaryColor = '#ffea00'; // Yellow
        }
        // Evening (17-19): Purple/Pink (Sunset)
        else if (hour >= 17 && hour < 20) {
            accentColor = '#ff0055'; // Pink
            secondaryColor = '#bd00ff'; // Purple
        }
        // Night (20-4): Deep Blue/Neon Blue (Cyberpunk)
        else {
            accentColor = '#4d4dff'; // Neon Blue
            secondaryColor = '#00f3ff'; // Light Blue
        }

        glowColor = `rgba(${hexToRgb(accentColor)}, 0.6)`;

        root.style.setProperty('--accent-color', accentColor);
        root.style.setProperty('--accent-glow', glowColor);
        root.style.setProperty('--secondary-accent', secondaryColor);
    }

    // Helper to convert hex to rgb for glow
    function hexToRgb(hex) {
        let r = 0, g = 0, b = 0;
        if (hex.length === 4) {
            r = parseInt("0x" + hex[1] + hex[1]);
            g = parseInt("0x" + hex[2] + hex[2]);
            b = parseInt("0x" + hex[3] + hex[3]);
        } else if (hex.length === 7) {
            r = parseInt("0x" + hex[1] + hex[2]);
            g = parseInt("0x" + hex[3] + hex[4]);
            b = parseInt("0x" + hex[5] + hex[6]);
        }
        return `${r}, ${g}, ${b}`;
    }

    /**
     * AI Chat Logic
     */
    const chatInput = document.getElementById('userChtInput');
    const sendBtn = document.getElementById('sendBtn');

    async function handleChat() {
        const text = chatInput.value.trim();
        if (!text) return;

        // UI Update
        elements.aiMessage.textContent = "考え中...";
        elements.aiMessage.classList.remove('typing-effect');
        chatInput.value = "";

        // Check API Key
        if (!CONFIG.OPENAI_API_KEY) {
            setTimeout(() => {
                elements.aiMessage.textContent = "APIキーが設定されていません。secrets.jsを確認してください。";
            }, 500);
            return;
        }

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: "You are a helpful and stylish clock AI assistant. Keep responses short and polite (under 60 chars)." },
                        { role: "user", content: text }
                    ],
                    max_tokens: 60
                })
            });

            const data = await response.json();
            if (data.choices && data.choices.length > 0) {
                const reply = data.choices[0].message.content;
                elements.aiMessage.textContent = reply;
                // Re-trigger animation
                void elements.aiMessage.offsetWidth;
                elements.aiMessage.classList.add('typing-effect');
            } else {
                throw new Error("No response");
            }
        } catch (error) {
            console.error(error);
            elements.aiMessage.textContent = "通信エラーが発生しました。";
        }
    }

    sendBtn.addEventListener('click', handleChat);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });

});

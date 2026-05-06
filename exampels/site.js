export const site = {
    css: /*css */`
        #hero {
            padding: 60px 20px;
            font-family: 'Segoe UI', sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            text-align: center;
        }

        #hero_content {
            margin-bottom: 60px;
        }

        #main_title {
            font-size: 48px;
            font-weight: 800;
            margin-bottom: 20px;
            color: #1a1a1a;
            line-height: 1.1;
        }

        #hero_text {
            font-size: 20px;
            color: #666;
            margin-bottom: 30px;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        #features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            text-align: right;
        }

        .feature-card {
            background: white;
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            border: 1px solid #f0f0f0;
            transition: all 0.3s ease;
        }

        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
        }

        .card-icon {
            font-size: 40px;
            margin-bottom: 20px;
            background: #f0f9ff;
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }`,

    html: /*html */`
    <section id="hero" class="hero-section">
        <div id="hero_content" class="hero-content">
            <h1 id="main_title" class="hero-title">בנה את העתיד שלך</h1>
            <p id="hero_text" class="hero-subtitle">הפלטפורמה המתקדמת ביותר לבניית מוצרים דיגיטליים במהירות ובקלות.</p>
        </div>
        <div id="features" class="features-grid">
            <div id="card_1" class="feature-card">
                <div id="icon_1" class="card-icon">🚀</div>
                <h3 id="title_1">מהירות</h3>
                <p id="desc_1">ביצועים מהירים פי 10.</p>
            </div>
            <div id="card_2" class="feature-card">
                <div id="icon_2" class="card-icon">🎨</div>
                <h3 id="title_2">עיצוב</h3>
                <p id="desc_2">ממשק משתמש מודרני ונקי.</p>
            </div>
            <div id="card_3" class="feature-card">
                <div id="icon_3" class="card-icon">🔒</div>
                <h3 id="title_3">אבטחה</h3>
                <p id="desc_3">הגנה ברמה צבאית למידע.</p>
            </div>
        </div>
    </section>`
}
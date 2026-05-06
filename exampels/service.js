export const service = {
    css: /*css*/`

        #pricing_section {
            display: flex;
            justify-content: center;
            gap: 30px;
            padding: 60px 20px;
            background-color: #f8fafc;
            flex-wrap: wrap;
            font-family: 'Segoe UI', sans-serif;
        }

        .pricing-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 40px;
            width: 300px;
            text-align: center;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            position: relative;
            transition: transform 0.3s ease;
        }

        .pricing-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .popular {
            border: 2px solid #3b82f6;
            background: #eff6ff;
        }

        .popular-badge {
            position: absolute;
            top: -15px;
            right: 50%;
            transform: translateX(50%);
            background: #3b82f6;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
        }

        .plan-price {
            font-size: 48px;
            font-weight: 800;
            color: #1e293b;
            margin: 20px 0;
        }

        .plan-features {
            list-style: none;
            padding: 0;
            margin: 30px 0;
            text-align: right;
            line-height: 2.5;
            color: #64748b;
        }

        .plan-btn {
            width: 100%;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid #3b82f6;
            background: transparent;
            color: #3b82f6;
            font-weight: bold;
            cursor: pointer;
        }

        .plan-btn.primary {
            background: #3b82f6;
            color: white;
        }`,

    html: /*html*/ `
    <section id="pricing_section" class="pricing-container">
        <div id="plan_basic" class="pricing-card">
            <h3 id="p_title_1" class="plan-title">בסיסי</h3>
            <div id="p_price_1" class="plan-price">₪0</div>
            <ul id="p_list_1" class="plan-features">
                <li>פרויקט אחד</li>
                <li>5GB אחסון</li>
                <li>תמיכה במייל</li>
            </ul>
            <button id="p_btn_1" class="plan-btn">התחל חינם</button>
        </div>

        <div id="plan_pro" class="pricing-card popular">
            <div id="badge_pro" class="popular-badge">מומלץ</div>
            <h3 id="p_title_2" class="plan-title">מקצועי</h3>
            <div id="p_price_2" class="plan-price">₪49</div>
            <ul id="p_list_2" class="plan-features">
                <li>ללא הגבלת פרויקטים</li>
                <li>50GB אחסון</li>
                <li>תמיכה 24/7</li>
            </ul>
            <button id="p_btn_2" class="plan-btn primary">הצטרף עכשיו</button>
        </div>
    </section>`
}

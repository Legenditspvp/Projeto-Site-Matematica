import asyncio
from playwright.async_api import async_playwright
import os

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Caminho absoluto para o arquivo local
        path = os.path.abspath("index.html")
        await page.goto(f"file://{path}")

        # 1. Verificar Seções Obrigatórias
        sections = ["#home", "#sobre", "#projetos", "#contato", ".navbar", "footer"]
        for section in sections:
            assert await page.locator(section).count() > 0, f"Section {section} not found"
        print("All mandatory sections are present.")

        # 2. Verificar Navbar Fixa
        navbar_position = await page.evaluate("() => getComputedStyle(document.querySelector('.navbar')).position")
        assert navbar_position == "fixed", "Navbar is not fixed"
        print("Navbar is fixed.")

        # 3. Testar Alternância de Tema (Toggle)
        # O toggle deve estar marcado inicialmente (dark mode)
        # Como o input está com display: none, usamos force=True ou avaliamos o estado
        is_checked = await page.evaluate("() => document.getElementById('checkbox').checked")
        assert is_checked, "Theme toggle should be checked by default"

        # Mudar para Light Mode clicando no slider que é visível
        await page.click(".slider")
        await page.wait_for_timeout(500) # Esperar transição

        data_theme = await page.evaluate("() => document.documentElement.getAttribute('data-theme')")
        assert data_theme == "light", f"Theme should be light, but got {data_theme}"
        print("Switched to Light Mode successfully.")

        bg_color_light = await page.evaluate("() => getComputedStyle(document.body).backgroundColor")
        print(f"Light mode BG color: {bg_color_light}")

        # Voltar para Dark Mode
        await page.click(".slider")
        await page.wait_for_timeout(500)

        data_theme = await page.evaluate("() => document.documentElement.getAttribute('data-theme')")
        assert data_theme == "dark", f"Theme should be dark, but got {data_theme}"
        print("Switched back to Dark Mode successfully.")

        bg_color_dark = await page.evaluate("() => getComputedStyle(document.body).backgroundColor")
        print(f"Dark mode BG color: {bg_color_dark}")

        assert bg_color_light != bg_color_dark, "Background color should change between themes"

        # 4. Verificar Grid de Projetos e Cards
        cards_count = await page.locator(".project-card").count()
        assert cards_count >= 2, f"Expected at least 2 project cards, found {cards_count}"
        print(f"Found {cards_count} project cards.")

        # 5. Capturar Screenshots para verificação visual
        await page.screenshot(path="portfolio_dark_mode.png")
        await page.click(".slider")
        await page.wait_for_timeout(500)
        await page.screenshot(path="portfolio_light_mode.png")
        print("Screenshots saved.")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())

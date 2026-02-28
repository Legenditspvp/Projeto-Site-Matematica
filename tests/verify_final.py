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

        # Espera o loading simulado (1.5s no script.js)
        await page.wait_for_timeout(2000)

        # 1. Verificar rodapé
        footer_text = await page.inner_text("footer")
        print(f"Footer text: {footer_text}")
        assert "equações" not in footer_text.lower()

        # 2. Verificar badge vôlei
        # O Ginásio Municipal é o terceiro item (id 3)
        volei_badge = page.locator(".badge-volei").first
        await volei_badge.screenshot(path="final_volei_badge.png")
        print("Volei badge screenshot saved.")

        # 3. Testar Modal Dinâmico
        # Clicar no primeiro (Basquete - Arena Central)
        await page.click("text=Arena Central")
        await page.wait_for_timeout(500)
        basket_img = await page.get_attribute("#modal-img", "src")
        print(f"Basketball modal image: {basket_img}")
        await page.screenshot(path="final_modal_basketball.png")

        # Fechar modal (clicando no overlay ou no botão fechar)
        await page.click(".close-modal")
        await page.wait_for_timeout(500)

        # Clicar no Ginásio Municipal (Vôlei)
        await page.click("text=Ginásio Municipal")
        await page.wait_for_timeout(500)
        volei_img = await page.get_attribute("#modal-img", "src")
        print(f"Volleyball modal image: {volei_img}")
        await page.screenshot(path="final_modal_volleyball.png")

        assert basket_img != volei_img, "Modal images should be different for different courts"

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())

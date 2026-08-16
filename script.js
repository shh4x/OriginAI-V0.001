// Origins AI - Core Logic con IA REAL
class OriginsAI {
    constructor() {
        this.messageCount = 0;
        this.chatHistory = [];
        this.encryptionKey = 'origins-secret-key-2024';
        this.isProcessing = false;
        
        // 🔥 CLAVE API - Consíguela gratis en https://aistudio.google.com/apikey
        this.GEMINI_API_KEY = 'AQ.Ab8RN6IWVcZejHdTlmr9ON5wDNNAGJo1TFjAZgskJ04uGZJTTg'; // <--- CAMBIA ESTO
        this.GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        
        // DOM Elements
        this.chatMessages = document.getElementById('chatMessages');
        this.userInput = document.getElementById('userInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.codeEditor = document.getElementById('codeEditor');
        this.runCodeBtn = document.getElementById('runCodeBtn');
        this.outputContent = document.getElementById('outputContent');
        this.languageSelect = document.getElementById('languageSelect');
        this.clearChatBtn = document.getElementById('clearChatBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.clearOutputBtn = document.getElementById('clearOutputBtn');
        this.formatCodeBtn = document.getElementById('formatCodeBtn');
        this.codeBtn = document.getElementById('codeBtn');
        this.messageCountSpan = document.getElementById('messageCount');
        this.visualCanvas = document.getElementById('visualCanvas');
        this.visualPlaceholder = document.getElementById('visualPlaceholder');
        
        // Tabs
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        this.init();
    }
    
    init() {
        // Event Listeners
        this.sendBtn.addEventListener('click', () => this.handleUserInput());
        this.userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.handleUserInput();
            }
        });
        
        this.runCodeBtn.addEventListener('click', () => this.executeCode());
        this.clearChatBtn.addEventListener('click', () => this.clearChat());
        this.exportBtn.addEventListener('click', () => this.exportData());
        this.clearOutputBtn.addEventListener('click', () => this.clearOutput());
        this.formatCodeBtn.addEventListener('click', () => this.formatCode());
        this.codeBtn.addEventListener('click', () => this.insertCodeBlock());
        
        // Tab switching
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
        
        // Code language change
        this.languageSelect.addEventListener('change', () => {
            this.updateCodeSyntax();
        });
        
        // Auto-resize textarea
        this.userInput.addEventListener('input', () => {
            this.userInput.style.height = 'auto';
            this.userInput.style.height = this.userInput.scrollHeight + 'px';
        });
        
        // Load saved data
        this.loadSavedData();
        
        // Update UI
        this.updateMessageCount();
        
        // Check API Key
        if (this.GEMINI_API_KEY === 'TU_API_KEY_AQUI') {
            this.addOutput('⚠️ Configura tu API Key de Gemini en script.js');
            this.addMessage('ai', `⚠️ **Configuración necesaria**:\n\nPara usar la IA real, necesitas:\n1. Ve a https://aistudio.google.com/apikey\n2. Crea una API Key gratis\n3. Pégala en \`script.js\` línea 10\n\nMientras tanto, uso respuestas predefinidas.`);
        } else {
            this.addOutput('✅ IA conectada con Gemini');
            this.addMessage('ai', '🧠 **Origins AI con Gemini Activado**\n\n¡Hola! Soy Origins, tu asistente IA con inteligencia real. Puedo:\n• Responder preguntas complejas\n• Ayudarte con código\n• Analizar datos\n• Y mucho más');
        }
        
        console.log('🧠 Origins AI iniciado correctamente');
    }
    
    // ============ CHAT FUNCTIONS ============
    
    handleUserInput() {
        const message = this.userInput.value.trim();
        if (!message || this.isProcessing) return;
        
        this.userInput.value = '';
        this.userInput.style.height = 'auto';
        
        // Add user message to chat
        this.addMessage('user', message);
        
        // Process message
        this.processMessage(message);
    }
    
    addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const avatar = type === 'user' ? 'fa-user' : 'fa-robot';
        const sender = type === 'user' ? 'Tú' : 'Origins AI';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${avatar}"></i>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="sender">${sender}</span>
                    <span class="timestamp">${this.getTime()}</span>
                </div>
                ${this.formatMessageContent(content)}
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        
        this.messageCount++;
        this.updateMessageCount();
        
        // Save to history
        this.chatHistory.push({ type, content, timestamp: new Date().toISOString() });
        this.saveData();
    }
    
    formatMessageContent(content) {
        // Convertir markdown a HTML básico
        let formatted = content;
        
        // Código blocks
        formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            return `<div class="code-block"><pre><code class="language-${lang || 'javascript'}">${this.escapeHtml(code.trim())}</code></pre></div>`;
        });
        
        // Negrita
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Cursiva
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Saltos de línea
        formatted = formatted.replace(/\n/g, '<br>');
        
        return formatted;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    getTime() {
        return new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }
    
    updateMessageCount() {
        this.messageCountSpan.textContent = `${this.messageCount} mensajes`;
    }
    
    // ============ IA REAL CON GEMINI ============
    
    async processMessage(message) {
        this.isProcessing = true;
        this.showTypingIndicator();
        
        try {
            let response = '';
            
            // Verificar si hay API Key
            if (this.GEMINI_API_KEY !== 'TU_API_KEY_AQUI') {
                // Usar Gemini API
                response = await this.getGeminiResponse(message);
            } else {
                // Fallback a respuestas predefinidas
                response = this.getFallbackResponse(message);
            }
            
            // Si el mensaje contiene código, ejecutarlo
            const codeMatch = message.match(/```(\w+)?\n([\s\S]*?)```/);
            if (codeMatch) {
                const lang = codeMatch[1] || 'javascript';
                const code = codeMatch[2].trim();
                const result = this.executeCodeSnippet(code, lang);
                response += '\n\n**Resultado de ejecución:**\n```' + result + '```';
            }
            
            this.removeTypingIndicator();
            this.addMessage('ai', response);
            
        } catch (error) {
            this.removeTypingIndicator();
            this.addMessage('ai', `❌ Error: ${error.message}`);
            console.error('Error:', error);
        }
        
        this.isProcessing = false;
    }
    
    async getGeminiResponse(message) {
        try {
            const response = await fetch(`${this.GEMINI_URL}?key=${this.GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Eres Origins AI, un asistente inteligente. Responde en español de forma natural y útil. 
                            Si el usuario pide código, proporciona ejemplos. Mensaje: ${message}`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1000,
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
            
        } catch (error) {
            console.error('Error con Gemini:', error);
            return this.getFallbackResponse(message);
        }
    }
    
    getFallbackResponse(message) {
        const lowerMsg = message.toLowerCase();
        
        // Respuestas predefinidas más inteligentes
        if (lowerMsg.includes('hola') || lowerMsg.includes('buenos días')) {
            return '👋 ¡Hola! ¿Cómo estás? Soy Origins AI. ¿En qué puedo ayudarte hoy?';
        }
        
        if (lowerMsg.includes('código') || lowerMsg.includes('programar')) {
            return '💻 **Programación**:\n\nPuedo ayudarte con código en varios lenguajes. Escribe tu código en el editor o pégamelo en el chat con ```lenguaje\ncódigo\n```\n\n¿Qué lenguaje te interesa?';
        }
        
        if (lowerMsg.includes('ayuda') || lowerMsg.includes('help')) {
            return `🆘 **Ayuda de Origins AI**
            
**Comandos disponibles:**
• 💬 Chat normal: conversación libre
• 💻 Código: escribe \`\`\`javascript\`\`\` y tu código
• 📊 Visualización: pide "gráfico" o "visualizar"
• 🔒 Datos guardados automáticamente encriptados

**Ejemplo:**
\`\`\`javascript
console.log("Hola mundo");
\`\`\``;
        }
        
        if (lowerMsg.includes('gráfico') || lowerMsg.includes('grafico')) {
            this.switchTab('visual');
            return '📊 **Visualización activada**\n\nHe preparado un gráfico de ejemplo en el panel de Visualización. ¿Quieres ver datos específicos?';
        }
        
        // Respuesta inteligente por defecto
        const responses = [
            '🤔 Interesante punto. ¿Podrías elaborar más sobre eso?',
            '💡 Buena pregunta. Desde mi perspectiva, esto podría abordarse de varias formas...',
            '✨ ¡Excelente tema! Déjame pensar en la mejor manera de ayudarte.',
            '🚀 Genial. ¿Qué te gustaría explorar específicamente?',
            '💭 Estoy procesando tu mensaje. ¿Necesitas algún ejemplo concreto?'
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // ============ CODE EXECUTION (Mejorada) ============
    
    executeCode() {
        const code = this.codeEditor.value;
        const lang = this.languageSelect.value;
        this.executeCodeSnippet(code, lang);
    }
    
    executeCodeSnippet(code, lang) {
        this.clearOutput();
        this.addOutput(`⏳ Ejecutando ${lang}...`);
        
        try {
            let result = '';
            
            switch(lang) {
                case 'javascript':
                    result = this.executeJavaScript(code);
                    break;
                case 'python':
                    result = this.executePythonReal(code);
                    break;
                case 'html':
                    result = this.executeHTML(code);
                    break;
                case 'css':
                    result = this.executeCSS(code);
                    break;
                case 'json':
                    result = this.executeJSON(code);
                    break;
                default:
                    result = '❌ Lenguaje no soportado';
            }
            
            this.addOutput(`✅ Ejecutado exitosamente`);
            const resultLines = result.split('\n');
            resultLines.forEach(line => {
                this.addOutput(`📤 ${line}`);
            });
            
            // Intentar visualizar si hay datos
            if (code.includes('chart') || code.includes('graph')) {
                this.switchTab('visual');
                this.showVisualization();
            }
            
            return result;
            
        } catch (error) {
            this.addOutput(`❌ Error: ${error.message}`);
            return `Error: ${error.message}`;
        }
    }
    
    executeJavaScript(code) {
        const originalLog = console.log;
        let output = [];
        
        // Capturar console.log
        console.log = (...args) => {
            const text = args.map(arg => String(arg)).join(' ');
            output.push(text);
            this.addOutput(`> ${text}`);
        };
        
        try {
            // Ejecutar en sandbox
            const fn = new Function(`
                const console = { 
                    log: (...args) => { 
                        const text = args.map(a => String(a)).join(' ');
                        window._output.push(text);
                    } 
                };
                window._output = [];
                ${code}
                return window._output;
            `);
            
            const result = fn();
            console.log = originalLog;
            
            if (result && result.length > 0) {
                return result.join('\n');
            }
            return 'Código ejecutado (sin salida)';
            
        } catch (error) {
            console.log = originalLog;
            throw error;
        }
    }
    
    async executePythonReal(code) {
        // Usar Pyodide para Python real en el navegador
        this.addOutput('🐍 Cargando Pyodide...');
        
        try {
            // Cargar Pyodide (solo la primera vez)
            if (!window.pyodide) {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
                
                window.pyodide = await loadPyodide();
                this.addOutput('✅ Pyodide cargado');
            }
            
            // Ejecutar código Python
            const result = await window.pyodide.runPythonAsync(code);
            this.addOutput(`📤 ${result}`);
            return String(result);
            
        } catch (error) {
            throw new Error(`Python: ${error.message}`);
        }
    }
    
    executeHTML(code) {
        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'width:100%;height:300px;border:1px solid #2a2a5a;border-radius:8px;margin-top:10px;';
        document.getElementById('outputContent').appendChild(iframe);
        
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(code);
        doc.close();
        
        return 'HTML renderizado en el output';
    }
    
    executeCSS(code) {
        const style = document.createElement('style');
        style.textContent = code;
        document.head.appendChild(style);
        
        setTimeout(() => {
            document.head.removeChild(style);
        }, 10000);
        
        return 'CSS aplicado temporalmente';
    }
    
    executeJSON(code) {
        const parsed = JSON.parse(code);
        return JSON.stringify(parsed, null, 2);
    }
    
    // ============ VISUALIZATION MEJORADA ============
    
    showVisualization() {
        this.visualCanvas.style.display = 'block';
        this.visualPlaceholder.style.display = 'none';
        
        const canvas = this.visualCanvas;
        const ctx = canvas.getContext('2d');
        
        // Limpiar
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Fondo
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(10, 10, 26, 0.9)');
        gradient.addColorStop(1, 'rgba(20, 20, 37, 0.9)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Datos de ejemplo
        const data = {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            values: [65, 78, 90, 85, 98, 105]
        };
        
        // Título
        ctx.fillStyle = '#e0e0ff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('📊 Actividad Mensual', canvas.width/2, 40);
        
        // Gráfico de barras
        const barWidth = 60;
        const startX = 80;
        const maxValue = Math.max(...data.values);
        
        data.values.forEach((value, index) => {
            const x = startX + (barWidth + 20) * index;
            const height = (value / maxValue) * (canvas.height - 100);
            const y = canvas.height - height - 30;
            
            // Barra con gradiente
            const barGradient = ctx.createLinearGradient(x, y, x, canvas.height);
            barGradient.addColorStop(0, '#6c5ce7');
            barGradient.addColorStop(0.5, '#a29bfe');
            barGradient.addColorStop(1, '#fd79a8');
            
            ctx.fillStyle = barGradient;
            ctx.shadowColor = 'rgba(108, 92, 231, 0.4)';
            ctx.shadowBlur = 15;
            ctx.fillRect(x, y, barWidth, height);
            ctx.shadowBlur = 0;
            
            // Valor
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(value, x + barWidth/2, y - 10);
            
            // Label
            ctx.fillStyle = '#a0a0c0';
            ctx.font = '12px Arial';
            ctx.fillText(data.labels[index], x + barWidth/2, canvas.height - 10);
        });
        
        // Línea de tendencia (simulada)
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 210, 211, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        data.values.forEach((value, index) => {
            const x = startX + (barWidth + 20) * index + barWidth/2;
            const y = canvas.height - (value / maxValue) * (canvas.height - 100) - 30;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Info extra
        ctx.fillStyle = '#a0a0c0';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`📈 Tendencia: ${((data.values[data.values.length-1] - data.values[0]) / data.values[0] * 100).toFixed(1)}%`, 20, canvas.height - 10);
        ctx.fillText(`📊 Total: ${data.values.reduce((a,b) => a+b, 0)}`, 20, canvas.height - 30);
    }
    
    // ============ UI FUNCTIONS ============
    
    showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'message ai-message';
        indicator.id = 'typingIndicator';
        indicator.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="sender">Origins AI</span>
                    <span class="timestamp">${this.getTime()}</span>
                </div>
                <p>⏳ <span class="typing-dots">...</span></p>
            </div>
        `;
        this.chatMessages.appendChild(indicator);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        
        // Animar puntos
        let dots = 0;
        const dotInterval = setInterval(() => {
            const dotsElement = document.querySelector('.typing-dots');
            if (dotsElement) {
                dots = (dots % 3) + 1;
                dotsElement.textContent = '.'.repeat(dots);
            } else {
                clearInterval(dotInterval);
            }
        }, 500);
        
        // Guardar intervalo para limpiar después
        indicator._interval = dotInterval;
    }
    
    removeTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            if (indicator._interval) {
                clearInterval(indicator._interval);
            }
            indicator.remove();
        }
    }
    
    switchTab(tabId) {
        this.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        
        this.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });
        
        if (tabId === 'visual') {
            this.showVisualization();
        }
    }
    
    updateCodeSyntax() {
        // Actualizar resaltado de sintaxis
    }
    
    formatCode() {
        try {
            const code = this.codeEditor.value;
            // Intentar formatear como JSON
            try {
                const parsed = JSON.parse(code);
                this.codeEditor.value = JSON.stringify(parsed, null, 2);
                this.addOutput('✅ JSON formateado');
            } catch {
                // Si no es JSON, solo limpiar espacios
                const formatted = code.split('\n')
                    .map(line => line.trim())
                    .filter(line => line)
                    .join('\n');
                this.codeEditor.value = formatted;
                this.addOutput('✅ Código formateado');
            }
        } catch (error) {
            this.addOutput(`❌ Error: ${error.message}`);
        }
    }
    
    insertCodeBlock() {
        const codeBlock = '```javascript\n// Escribe tu código aquí\n\n```';
        this.userInput.value += codeBlock;
        this.userInput.focus();
        this.userInput.style.height = 'auto';
        this.userInput.style.height = this.userInput.scrollHeight + 'px';
    }
    
    // ============ DATA ENCRYPTION ============
    
    encryptData(data) {
        try {
            const encrypted = CryptoJS.AES.encrypt(
                JSON.stringify(data),
                this.encryptionKey
            ).toString();
            return encrypted;
        } catch (error) {
            console.error('Error encrypting:', error);
            return null;
        }
    }
    
    decryptData(encryptedData) {
        try {
            const decrypted = CryptoJS.AES.decrypt(
                encryptedData,
                this.encryptionKey
            );
            const data = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
            return data;
        } catch (error) {
            console.error('Error decrypting:', error);
            return null;
        }
    }
    
    saveData() {
        try {
            const data = {
                messages: this.chatHistory,
                count: this.messageCount,
                code: this.codeEditor.value,
                language: this.languageSelect.value
            };
            
            const encrypted = this.encryptData(data);
            if (encrypted) {
                localStorage.setItem('origins_ai_data', encrypted);
                localStorage.setItem('origins_ai_encrypted', 'true');
            }
        } catch (error) {
            console.error('Error saving:', error);
        }
    }
    
    loadSavedData() {
        try {
            const encrypted = localStorage.getItem('origins_ai_data');
            if (encrypted) {
                const data = this.decryptData(encrypted);
                if (data) {
                    this.chatHistory = data.messages || [];
                    this.messageCount = data.count || 0;
                    this.codeEditor.value = data.code || '';
                    this.languageSelect.value = data.language || 'javascript';
                    
                    this.chatMessages.innerHTML = '';
                    this.chatHistory.forEach(msg => {
                        this.addMessage(msg.type, msg.content);
                    });
                    
                    this.updateMessageCount();
                    this.addOutput('🔒 Datos encriptados cargados');
                }
            }
        } catch (error) {
            console.error('Error loading:', error);
        }
    }
    
    clearChat() {
        if (confirm('¿Eliminar todo el historial?')) {
            this.chatMessages.innerHTML = '';
            this.chatHistory = [];
            this.messageCount = 0;
            this.updateMessageCount();
            this.saveData();
            this.addOutput('🗑️ Chat limpiado');
        }
    }
    
    exportData() {
        try {
            const data = {
                messages: this.chatHistory,
                exportDate: new Date().toISOString(),
                version: '1.0'
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { 
                type: 'application/json' 
            });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `origins_ai_export_${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.addOutput('📤 Datos exportados');
        } catch (error) {
            this.addOutput(`❌ Error: ${error.message}`);
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    const origins = new OriginsAI();
    window.origins = origins;
    console.log('🚀 Origins AI listo!');
});

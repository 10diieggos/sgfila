# SGFILA v3.0 - Guia de Portabilidade

## ✅ Sim, o sistema é completamente portátil!

Você pode copiar toda a pasta `nt` para outro computador e tudo funcionará, **independente do caminho**.

---

## 📂 O que copiar

Copie a pasta inteira `nt` que contém:

```
nt/
├── node.exe           (Node.js portátil)
├── npm.cmd
├── node_modules/      (do Node.js)
└── sg/                (sistema SGFILA)
    ├── v3/
    │   ├── server/
    │   │   ├── node_modules/   ✅ IMPORTANTE
    │   │   ├── dist/           ✅ IMPORTANTE
    │   │   └── dados.json      ✅ Seus dados!
    │   └── client/
    │       ├── node_modules/   ✅ IMPORTANTE
    │       └── dist/           ✅ IMPORTANTE
    └── *.bat               ✅ Scripts funcionam em qualquer lugar
```

---

## 🚀 Como usar em outro computador

### Opção 1: Copiar tudo já instalado (RECOMENDADO)

Se você já executou `instalar.bat` e tem as pastas `node_modules` e `dist`:

1. **Copie a pasta `nt` inteira** para o novo computador
   - Pode ser para qualquer caminho: `C:\`, `D:\Projetos\`, `C:\Users\Outro\Desktop\`, etc.

2. **Navegue até a pasta `sg`**
   ```batch
   cd [CAMINHO]\nt\sg
   ```

3. **Execute o sistema**
   ```batch
   iniciar.bat
   ```

**Pronto!** Funciona imediatamente, sem necessidade de reinstalar nada.

---

### Opção 2: Copiar código-fonte e instalar

Se você quer copiar apenas o código (sem `node_modules` e `dist`):

1. **Copie a pasta `nt` para o novo computador**

2. **Execute a instalação**
   ```batch
   cd [CAMINHO]\nt\sg
   instalar.bat
   ```

3. **Aguarde a instalação** (alguns minutos)

4. **Execute o sistema**
   ```batch
   iniciar.bat
   ```

---

## 🔧 Por que funciona em qualquer lugar?

### 1. Caminhos Relativos
Os scripts usam **caminhos relativos**, não absolutos:

```batch
REM Procura node.exe na pasta PAI, seja qual for o caminho
if exist "..\node.exe" (
    set NODE_DIR=%CD%\..
)
```

### 2. PATH Temporário
O PATH do Node.js é configurado **dinamicamente** toda vez que você executa:

```batch
REM Adiciona Node.js ao PATH apenas para esta sessão
set PATH=!NODE_DIR!;%PATH%
```

### 3. Estrutura Independente
O sistema não depende de:
- ❌ Registro do Windows
- ❌ Variáveis de ambiente globais
- ❌ Instalações do sistema
- ❌ Permissões administrativas
- ❌ Caminhos fixos/hardcoded

---

## 📊 Exemplos de Portabilidade

### Cenário 1: Pen Drive USB
```
E:\
└── nt\
    ├── node.exe
    └── sg\
        └── iniciar.bat  ✅ Funciona!
```

### Cenário 2: Rede Compartilhada
```
\\SERVIDOR\Compartilhado\nt\
└── sg\
    └── iniciar.bat  ✅ Funciona!
```

### Cenário 3: Diferentes Usuários
```
Computador 1: C:\Users\Diego\Downloads\nt\  ✅ Funciona!
Computador 2: D:\Sistemas\nt\               ✅ Funciona!
Computador 3: C:\nt\                        ✅ Funciona!
```

---

## ⚠️ Importante: O que preservar

### Seus Dados
O arquivo `v3/server/dados.json` contém:
- Todas as senhas geradas
- Configurações de guichês
- Contadores
- Estado do sistema

**Sempre faça backup deste arquivo antes de copiar!**

Use o script:
```batch
backup.bat
```

### Estrutura de Pastas
Mantenha a estrutura de pastas **exatamente como está**:
- `sg` deve estar **dentro** da pasta que contém `node.exe`
- Não mova `v3/server` ou `v3/client` separadamente

---

## 🖥️ Requisitos do Computador de Destino

### Sistema Operacional
- ✅ Windows 7 ou superior
- ✅ Windows Server 2008 R2 ou superior

### Hardware Mínimo
- 💾 RAM: 512 MB disponível
- 💿 Disco: 200 MB disponível
- 🖥️ Processador: Qualquer (x64)

### Rede (para acesso remoto)
- 🌐 Adaptador de rede configurado
- 🔓 Porta 3000 liberada no Firewall (se necessário)

### Não é necessário
- ❌ Internet
- ❌ Permissões de administrador
- ❌ Node.js instalado no sistema
- ❌ Visual Studio
- ❌ Git
- ❌ Nenhum outro software

---

## 🧪 Teste de Portabilidade

Para verificar se tudo funcionará no novo computador:

1. **Em uma pasta temporária diferente**, copie `nt`
2. **Execute:**
   ```batch
   cd [CAMINHO_TEMPORARIO]\nt\sg
   iniciar.bat
   ```
3. **Acesse:** http://localhost:3000
4. **Se funcionar:** Pode copiar para qualquer lugar! ✅

---

## 📝 Checklist de Cópia

Ao copiar para outro computador:

- [ ] Copiar pasta `nt` completa
- [ ] Verificar se `node.exe` está presente
- [ ] Verificar se `dados.json` está presente (seus dados!)
- [ ] Verificar se pastas `node_modules` estão presentes
- [ ] Verificar se pastas `dist` estão presentes
- [ ] Executar `iniciar.bat`
- [ ] Testar acesso em http://localhost:3000
- [ ] (Opcional) Configurar Firewall para acesso na rede

---

## 🔒 Segurança na Cópia

### Via Rede Local
```batch
REM Copiar via rede
xcopy /E /I /H C:\Users\Diego\Downloads\nt \\OUTRO-PC\C$\nt
```

### Via Pen Drive
Simplesmente copie e cole a pasta `nt` completa.

### Via Compartilhamento
Compartilhe a pasta `nt` e acesse de outros computadores diretamente pela rede (o sistema funcionará mesmo em rede compartilhada).

---

## 🎯 Cenários de Uso

### 1. Desenvolvimento → Produção
- Desenvolva em: `C:\Dev\nt\`
- Copie para: `C:\Producao\nt\`
- Funciona identicamente! ✅

### 2. Backup/Restauração
```batch
REM Fazer backup
xcopy /E /I /H C:\nt C:\Backup\nt_%DATE%

REM Restaurar backup
xcopy /E /I /H C:\Backup\nt_19-11-2025 C:\nt
```

### 3. Múltiplas Instâncias
Pode ter várias cópias independentes:
```
C:\nt-producao\
C:\nt-homologacao\
C:\nt-desenvolvimento\
```

Cada uma com seus próprios dados e configurações.

**ATENÇÃO:** Use portas diferentes!
```batch
REM Terminal 1
set PORT=3000
cd C:\nt-producao\sg
iniciar.bat

REM Terminal 2
set PORT=3001
cd C:\nt-homologacao\sg
iniciar.bat
```

---

## ❓ Perguntas Frequentes

### 1. Precisa reinstalar no novo computador?
**Não!** Se copiar com `node_modules` e `dist`, funciona imediatamente.

### 2. O caminho precisa ser o mesmo?
**Não!** Funciona em qualquer caminho.

### 3. Precisa de permissão de administrador?
**Não!** A menos que precise configurar o Firewall.

### 4. Funciona em pen drive?
**Sim!** Totalmente funcional.

### 5. Funciona em rede compartilhada?
**Sim!** Mas pode ser mais lento.

### 6. Posso ter várias cópias?
**Sim!** Cada cópia é independente.

### 7. Meus dados serão preservados?
**Sim!** Se copiar o `dados.json`.

### 8. Funciona em outro usuário do Windows?
**Sim!** Totalmente independente do usuário.

---

## 🆘 Solução de Problemas

### Erro: "Node.js não encontrado"
**Solução:** Verifique se `node.exe` está na pasta pai de `sg`:
```
nt/
├── node.exe  ← Aqui!
└── sg/
    └── iniciar.bat
```

### Erro: "Porta 3000 já em uso"
**Solução 1:** Mude a porta antes de executar:
```batch
set PORT=3001
iniciar.bat
```

**Solução 2:** Feche o outro servidor que está usando a porta 3000.

### Erro: "Acesso negado"
**Solução:** Copie para uma pasta onde você tem permissão de escrita:
- ✅ `C:\Users\[SEU_USUARIO]\`
- ✅ `D:\`
- ❌ `C:\Program Files\` (requer admin)
- ❌ `C:\Windows\` (requer admin)

---

## ✅ Conclusão

**O sistema SGFILA v3.0 é 100% portátil!**

Você pode:
- ✅ Copiar para qualquer computador
- ✅ Usar em qualquer caminho
- ✅ Executar de pen drive
- ✅ Compartilhar em rede
- ✅ Ter múltiplas cópias
- ✅ Fazer backup facilmente
- ✅ Funciona sem internet
- ✅ Não precisa de admin

**Basta copiar e executar `iniciar.bat`!** 🚀

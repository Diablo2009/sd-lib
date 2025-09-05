#! /usr/bin/env bash
{

function install_node() {
    local NVM_INSTALL="https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh"

    curl -o- $NVM_INSTALL | bash # Installs node version manager

    source "$HOME/.nvm/nvm.sh"

    nvm install 20.19.5
}

function install_sd() {
    local sd=$(mktemp)   # ~/.local/bin/sd
    local libA=$(mktemp) # ~/.local/lib/sd-lib.js
    local libB=$(mktemp) # ~/.local/share/sd-lib/sd-lib.js
    local decl=$(mktemp) # ~/.local/lib/sd-lib.d.ts

    curl -o- "https://raw.githubusercontent.com/Diablo2009/sd-lib/refs/heads/main/bin/sd" > "$sd"
    curl -o- "https://raw.githubusercontent.com/Diablo2009/sd-lib/refs/heads/main/lib/sd-lib.js" > "$libA"
    curl -o- "https://raw.githubusercontent.com/Diablo2009/sd-lib/refs/heads/main/share/sd-lib/sd-lib.js" > "$libB"
    curl -o- "https://raw.githubusercontent.com/Diablo2009/sd-lib/refs/heads/main/lib/sd-lib.d.ts" > "$decl"

    mkdir -p "$HOME/.local/bin" "$HOME/.local/lib" "$HOME/.local/share/sd-lib"

    cp "$sd"   "$HOME/.local/bin/sd"
    cp "$libA" "$HOME/.local/lib/sd-lib.js"
    cp "$libB" "$HOME/.local/share/sd-lib/sd-lib.js"
    cp "$decl" "$HOME/.local/lib/sd-lib.d.ts"

    chmod +x "$HOME/.local/bin/sd"

    # Exec sd-lib updater
    exec "$HOME/.local/bin/sd"
}

# Attempt Install of Node
if [[ -z $(command -v node) ]]; then
    install_node
fi

if [[ -z $(command -v sd) ]]; then
    if [[ ! -f "$HOME/.local/bin/sd" || ! -r "$HOME/.local/bin/sd" ]]; then
        install_sd
    else
        exec "$HOME/.local/bin/sd"
    fi
else
    exec sd
fi

echo "Please add '\$HOME/.local/bin' to '\$PATH'."

}
#! /usr/bin/env bash
{

function install_node() {
    local NVM_INSTALL="https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh"

    curl -o- $NVM_INSTALL | bash # Installs node version manager

    source "$HOME/.nvm/nvm.sh"

    nvm install 20.19.5
}

function install() {
    local SD_LIB_INSTALL="https://raw.githubusercontent.com/Diablo2009/sd-lib/refs/heads/main/bin/sd"

    curl -o- | node
}

# Attempt Install of Node
if [[ -z $(command -v node) ]]; then
    install_node
fi

if [[ -z $(command -v sh) ]]; then
    install
fi

echo "Please add '\$HOME/.local/bin' to '\$PATH'."

}
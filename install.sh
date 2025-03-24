#!/bin/bash

# 설정 파일 경로
CONFIG_FILE="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
CONFIG_DIR="$HOME/Library/Application Support/Claude"

# 서비스 이름
SERVICE_NAME="youtube-transcript"

# node 경로 찾기
NODE_PATH=$(which node)
if [ -z "$NODE_PATH" ]; then
  echo "Error: Node.js가 설치되어 있지 않습니다."
  exit 1
fi

# 현재 디렉토리
CURRENT_DIR=$(pwd)
INDEX_PATH="$CURRENT_DIR/build/index.js"

# build/index.js 파일이 존재하는지 확인
if [ ! -f "$INDEX_PATH" ]; then
  echo "Error: $INDEX_PATH 파일을 찾을 수 없습니다."
  exit 1
fi

# 디렉토리가 없으면 생성
if [ ! -d "$CONFIG_DIR" ]; then
  mkdir -p "$CONFIG_DIR"
  echo "디렉토리 생성됨: $CONFIG_DIR"
fi

# 파일이 존재하는지 확인
if [ ! -f "$CONFIG_FILE" ]; then
  # 파일이 없으면 새로 생성
  echo "{
  \"mcpServers\": {
    \"$SERVICE_NAME\": {
      \"command\": \"$NODE_PATH\",
      \"args\": [\"$INDEX_PATH\"]
    }
  }
}" > "$CONFIG_FILE"
  echo "설정 파일이 생성되었습니다: $CONFIG_FILE"
else
  # 파일이 존재하면 youtube-transcript가 있는지 확인
  if grep -q "\"$SERVICE_NAME\"" "$CONFIG_FILE"; then
    echo "$SERVICE_NAME 설정이 이미 존재합니다. 변경 없음."
  else
    # youtube-transcript가 없으면 추가
    # jq를 사용하여 JSON 파일 수정
    if command -v jq >/dev/null 2>&1; then
      # mcpServers 키가 있는지 확인
      if jq -e '.mcpServers' "$CONFIG_FILE" >/dev/null 2>&1; then
        # mcpServers 키가 있으면 youtube-transcript 추가
        jq --arg node "$NODE_PATH" --arg index "$INDEX_PATH" --arg name "$SERVICE_NAME" '.mcpServers += {($name): {"command": $node, "args": [$index]}}' "$CONFIG_FILE" > "$CONFIG_FILE.tmp" && mv "$CONFIG_FILE.tmp" "$CONFIG_FILE"
      else
        # mcpServers 키가 없으면 생성 후 youtube-transcript 추가
        jq --arg node "$NODE_PATH" --arg index "$INDEX_PATH" --arg name "$SERVICE_NAME" '. += {"mcpServers": {($name): {"command": $node, "args": [$index]}}}' "$CONFIG_FILE" > "$CONFIG_FILE.tmp" && mv "$CONFIG_FILE.tmp" "$CONFIG_FILE"
      fi
      echo "$SERVICE_NAME 설정이 추가되었습니다."
    else
      echo "Warning: jq가 설치되어 있지 않아 JSON 파일을 직접 수정할 수 없습니다."
      echo "jq를 설치하거나 수동으로 파일을 편집해주세요."
      echo "추가할 설정:"
      echo "\"$SERVICE_NAME\": {
        \"command\": \"$NODE_PATH\",
        \"args\": [\"$INDEX_PATH\"]
      }"
      exit 1
    fi
  fi
fi

echo "완료!"

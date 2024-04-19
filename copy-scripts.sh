source .env

# Check if directory path is provided as argument
if [ $# -ne 1 ]; then
  echo "Usage: $0 <directory>"
  exit 1
fi

# Check if the provided path is a directory
if [ ! -d "$1" ]; then
  echo "$1 is not a directory"
  exit 1
fi

for folder in "$1"/*; do
  if [ -d "$folder" ]; then
    echo "Copy script: $(basename "$folder")"
    cp scripts/$(basename "$folder")/$(basename "$folder").omnifocusjs "${OMNI_FOCUS_SCRIPT_FOLDER}/$(basename "$folder").omnijs"
  fi
done
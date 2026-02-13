
# Converts HEIC to jpg
for f in ~/Downloads/plants/*.(HEIC|heic); do
  base="${f:t:r}"
  out=~/Downloads/plants/jpeg_out/"$base".jpg

  sips -s format jpeg \
       -s formatOptions 80 \
       -Z 1600 \
       "$f" \
       --out "$out" >/dev/null
done

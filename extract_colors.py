#!/usr/bin/env python3
"""Extract dominant colors from the logo"""

from PIL import Image
from collections import Counter
import sys

def get_dominant_colors(image_path, num_colors=10):
    # Open image
    img = Image.open(image_path)

    # Convert to RGB if necessary
    img = img.convert('RGB')

    # Resize for faster processing
    img = img.resize((150, 150))

    # Get all pixels
    pixels = list(img.getdata())

    # Count colors
    color_counts = Counter(pixels)

    # Get most common colors
    most_common = color_counts.most_common(num_colors)

    print("\n🎨 LOGO COLOR ANALYSIS\n")
    print("=" * 60)
    print(f"{'Rank':<6} {'Color (RGB)':<20} {'Hex':<10} {'Count':<10}")
    print("=" * 60)

    for i, (color, count) in enumerate(most_common, 1):
        hex_color = '#{:02x}{:02x}{:02x}'.format(*color)
        print(f"{i:<6} {str(color):<20} {hex_color:<10} {count:<10}")

    print("=" * 60)

    # Group colors by type
    print("\n📊 COLOR CATEGORIES:")
    print("-" * 60)

    dark_greens = []
    medium_greens = []
    light_greens = []
    whites = []
    grays = []

    for color, count in most_common:
        r, g, b = color
        hex_color = '#{:02x}{:02x}{:02x}'.format(*color)

        # Categorize colors
        if r > 240 and g > 240 and b > 240:
            whites.append((hex_color, color, count))
        elif r < 50 and g < 80 and b < 50:
            dark_greens.append((hex_color, color, count))
        elif 50 <= r <= 150 and 80 <= g <= 150 and 50 <= b <= 100:
            medium_greens.append((hex_color, color, count))
        elif g > r and g > b:
            light_greens.append((hex_color, color, count))

    if dark_greens:
        print("\n🟢 DARK GREENS (Primary - Text, Borders):")
        for hex_c, rgb, count in dark_greens[:3]:
            print(f"   {hex_c} - RGB{rgb} - {count} pixels")

    if medium_greens:
        print("\n🟢 MEDIUM GREENS (Secondary - Elements):")
        for hex_c, rgb, count in medium_greens[:3]:
            print(f"   {hex_c} - RGB{rgb} - {count} pixels")

    if light_greens:
        print("\n🟢 LIGHT GREENS (Accents):")
        for hex_c, rgb, count in light_greens[:3]:
            print(f"   {hex_c} - RGB{rgb} - {count} pixels")

    if whites:
        print("\n⬜ WHITES/BACKGROUNDS:")
        for hex_c, rgb, count in whites[:2]:
            print(f"   {hex_c} - RGB{rgb} - {count} pixels")

    print("\n" + "=" * 60)

if __name__ == '__main__':
    image_path = '/Users/dith/projects/travel-globe-website/public/logo.png'
    get_dominant_colors(image_path, 15)

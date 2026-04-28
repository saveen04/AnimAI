"""
Download animal dataset using tensorflow_datasets.
Uses 'cats_vs_dogs' (2 classes: cat, dog) - built-in, no API keys needed.
Saves images to dataset/train and dataset/val in the format expected by train_model.py
"""
import os
import tensorflow as tf
import tensorflow_datasets as tfds

DATASET_DIR = os.path.join(os.path.dirname(__file__), "dataset")
TRAIN_DIR = os.path.join(DATASET_DIR, "train")
VAL_DIR = os.path.join(DATASET_DIR, "val")
SPLIT_TRAIN = "train[:80%]"
SPLIT_VAL = "train[80%:]"


def save_images(ds, output_dir, max_per_class=500):
    os.makedirs(os.path.join(output_dir, "cat"), exist_ok=True)
    os.makedirs(os.path.join(output_dir, "dog"), exist_ok=True)
    counts = {"cat": 0, "dog": 0}

    for i, example in enumerate(ds):
        img = example["image"]
        label = example["label"].numpy()
        name = "cat" if label == 0 else "dog"
        if counts[name] >= max_per_class:
            if counts["cat"] >= max_per_class and counts["dog"] >= max_per_class:
                break
            continue
        counts[name] += 1
        path = os.path.join(output_dir, name, f"{name}_{counts[name]:05d}.jpg")
        tf.io.write_file(path, tf.io.encode_jpeg(tf.cast(img, tf.uint8)))
    return counts


def main():
    print("Downloading cats_vs_dogs dataset (this may take a few minutes)...")
    ds_train = tfds.load("cats_vs_dogs", split=SPLIT_TRAIN, as_supervised=False)
    ds_val = tfds.load("cats_vs_dogs", split=SPLIT_VAL, as_supervised=False)

    print("Saving training images...")
    train_counts = save_images(ds_train, TRAIN_DIR, max_per_class=400)
    print(f"  Train: {train_counts}")

    print("Saving validation images...")
    val_counts = save_images(ds_val, VAL_DIR, max_per_class=100)
    print(f"  Val: {val_counts}")

    print(f"\nDataset ready at {DATASET_DIR}")
    print("Run: python train_model.py")


if __name__ == "__main__":
    main()

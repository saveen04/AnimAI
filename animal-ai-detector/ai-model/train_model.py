"""
CNN Training Script for Animal Species Detection
Uses TensorFlow/Keras. Train on dataset in dataset/train/ and dataset/val/
Folder structure: dataset/train/<class_name>/<images>, dataset/val/<class_name>/<images>
"""
import os
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Configuration
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 20
DATASET_DIR = os.path.join(os.path.dirname(__file__), "dataset")
TRAIN_DIR = os.path.join(DATASET_DIR, "train")
VAL_DIR = os.path.join(DATASET_DIR, "val")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "animal_model.h5")


def build_model(num_classes, input_shape=(224, 224, 3)):
    """Build a model using MobileNetV2 transfer learning."""
    # Base model with pre-trained weights from ImageNet
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=input_shape,
        include_top=False,
        weights="imagenet"
    )
    
    # Freeze the base model to preserve learned features
    base_model.trainable = False
    
    model = keras.Sequential([
        layers.Input(shape=input_shape),
        # MobileNetV2 specific preprocessing
        layers.Lambda(tf.keras.applications.mobilenet_v2.preprocess_input),
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dropout(0.3),
        layers.Dense(256, activation="relu"),
        layers.Dropout(0.3),
        layers.Dense(num_classes, activation="softmax"),
    ])
    
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=1e-3),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model


def get_class_names(train_dir):
    """Get sorted class names from train directory."""
    if not os.path.isdir(train_dir):
        return ["cat", "dog", "bird"]
    return sorted([d for d in os.listdir(train_dir) if os.path.isdir(os.path.join(train_dir, d))])


def main():
    print("Starting Animal Species Detection Training...")
    
    # Check if directories exist
    if not os.path.isdir(TRAIN_DIR):
        os.makedirs(TRAIN_DIR, exist_ok=True)
        os.makedirs(VAL_DIR, exist_ok=True)
        print(f"Dataset directories not found. Created {TRAIN_DIR} and {VAL_DIR}.")
        print("Please add your animal images into subfolders within these directories.")
        return

    # Data Augmentation for training
    train_datagen = ImageDataGenerator(
        rotation_range=30,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode="nearest",
    )
    
    # Validation data generator (only rescaling, no augmentation)
    val_datagen = ImageDataGenerator()

    # Flow from directory
    try:
        train_generator = train_datagen.flow_from_directory(
            TRAIN_DIR,
            target_size=IMG_SIZE,
            batch_size=BATCH_SIZE,
            class_mode="categorical",
            shuffle=True,
        )
        
        val_generator = val_datagen.flow_from_directory(
            VAL_DIR,
            target_size=IMG_SIZE,
            batch_size=BATCH_SIZE,
            class_mode="categorical",
            shuffle=False,
        )
    except Exception as e:
        print(f"Error loading images: {e}")
        return

    class_names = sorted(train_generator.class_indices.keys())
    num_classes = len(class_names)
    
    if num_classes == 0:
        print("No classes found in training directory. Aborting.")
        return

    print(f"Classes found: {class_names}")
    print(f"Number of classes: {num_classes}")

    # Build and compile model
    model = build_model(num_classes)
    model.summary()

    # Callbacks
    callbacks = [
        keras.callbacks.ModelCheckpoint(
            MODEL_PATH,
            save_best_only=True,
            monitor="val_accuracy",
            verbose=1
        ),
        keras.callbacks.EarlyStopping(
            monitor="val_loss",
            patience=5,
            restore_best_weights=True,
            verbose=1
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss', 
            factor=0.2, 
            patience=3, 
            min_lr=1e-6,
            verbose=1
        )
    ]

    # Training
    print("\nTraining started...")
    history = model.fit(
        train_generator,
        epochs=EPOCHS,
        validation_data=val_generator,
        callbacks=callbacks,
    )

    # Save final model and class names
    model.save(MODEL_PATH)
    with open(os.path.join(os.path.dirname(__file__), "class_names.txt"), "w") as f:
        f.write("\n".join(class_names))
    
    print("\nTraining complete!")
    print(f"Model saved to: {MODEL_PATH}")
    print(f"Class names saved to: class_names.txt")


if __name__ == "__main__":
    main()

from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
import numpy as np
import faiss
import json
import os
import pickle
from flask_cors import CORS
import joblib
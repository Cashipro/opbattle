# app.py
import streamlit as st
import pandas as pd
import json
import os
import subprocess
import sys
from datetime import datetime

# ===== PAGE CONFIG =====
st.set_page_config(
    page_title="CM Dashboard - PULSE Data",
    page_icon="🏛️",
    layout="wide"
)

# ===== CHECK AND DOWNLOAD DATA =====
DATA_DIR = "pulse_data"

def download_data():
    """Run extract.py to download data"""
    with st.spinner("📥 Downloading data from PULSE.GOP.PK... Please wait (may take 5-10 minutes)..."):
        try:
            # Run extract.py
            result = subprocess.run(
                [sys.executable, "extract.py"], 
                capture_output=True, 
                text=True,
                timeout=600  # 10 minutes timeout
            )
            if result.returncode == 0:
                st.success("✅ Data downloaded successfully!")
                return True
            else:
                st.error(f"❌ Error: {result.stderr}")
                return False
        except subprocess.TimeoutExpired:
            st.error("⏰ Timeout! Download took too long.")
            return False
        except Exception as e:
            st.error(f"❌ Error: {e}")
            return False

# ===== CHECK DATA =====
if not os.path.exists(DATA_DIR) or not any(f.startswith('pulse_data_') for f in os.listdir(DATA_DIR) if os.path.isfile(os.path.join(DATA_DIR, f))):
    st.warning("⚠️ No data found! Downloading now...")
    
    # Check if extract.py exists
    if not os.path.exists("extract.py"):
        st.error("❌ extract.py not found! Please upload it.")
        st.stop()
    
    if download_data():
        st.success("✅ Data ready! Refreshing...")
        st.rerun()
    else:
        st.error("Failed to download data. Please check logs.")
        st.stop()

# ===== SIMPLE PASSWORD PROTECTION =====
def check_password():
    if "authenticated" not in st.session_state:
        st.session_state.authenticated = False
    
    if not st.session_state.authenticated:
        st.title("🔒 Chief Minister's Office")
        st.subheader("Authorized Access Only")
        
        password = st.text_input("Enter Password:", type="password")
        if password == "Admin0987":  # 🔑 CHANGE THIS PASSWORD!
            st.session_state.authenticated = True
            st.rerun()
        elif password:
            st.error("❌ Wrong password!")
        return False
    return True

# ===== MAIN APP =====
if not check_password():
    st.stop()

# ===== LOAD DATA =====
st.title("🏛️ Chief Minister's Dashboard")
st.caption(f"🔒 Confidential | {datetime.now().strftime('%B %d, %Y')}")

# Find latest JSON file
json_files = [f for f in os.listdir(DATA_DIR) if f.startswith('pulse_data_') and f.endswith('.json')]

if not json_files:
    st.error("⚠️ No data files found!")
    st.stop()

# Load latest file
latest = sorted(json_files)[-1]
with open(f'{DATA_DIR}/{latest}', 'r') as f:
    data = json.load(f)

df = pd.DataFrame(data['data'])

# ===== STATS =====
col1, col2, col3, col4 = st.columns(4)
with col1:
    st.metric("📊 Total Records", f"{len(df):,}")
with col2:
    st.metric("🆔 Unique CNICs", f"{data['metadata']['unique_cnics']:,}")
with col3:
    st.metric("📱 Unique Phones", f"{data['metadata']['unique_phones']:,}")
with col4:
    districts = df['districtName'].nunique()
    st.metric("🏙️ Districts", districts)

# ===== FILTERS =====
st.subheader("🔍 Filter Records")

col1, col2 = st.columns(2)
with col1:
    district_filter = st.selectbox(
        "📍 District", 
        ['All'] + sorted(df['districtName'].dropna().unique().tolist())
    )
with col2:
    search = st.text_input("🔎 Search (Name/CNIC/Phone)")

# Apply filters
filtered_df = df.copy()
if district_filter != 'All':
    filtered_df = filtered_df[filtered_df['districtName'] == district_filter]
if search:
    filtered_df = filtered_df[
        filtered_df['personName'].str.contains(search, case=False, na=False) |
        filtered_df['personCNIC'].astype(str).str.contains(search, na=False) |
        filtered_df['personMobile'].astype(str).str.contains(search, na=False)
    ]

# ===== SHOW DATA =====
st.subheader(f"📋 Records: {len(filtered_df):,}")

# Select columns to display
columns_to_show = ['personName', 'personCNIC', 'personMobile', 'districtName', 'tehsilName']
available_cols = [col for col in columns_to_show if col in df.columns]

st.dataframe(
    filtered_df[available_cols],
    use_container_width=True,
    height=400
)

# ===== CHARTS =====
with st.expander("📊 District-wise Distribution"):
    if len(filtered_df) > 0:
        dist_data = filtered_df['districtName'].value_counts().head(20)
        st.bar_chart(dist_data)

# ===== EXPORT =====
with st.expander("📥 Export Data (Authorized Only)"):
    if st.button("Generate CSV"):
        csv = filtered_df.to_csv(index=False)
        st.download_button(
            "⬇️ Download CSV",
            csv,
            f"pulse_data_{datetime.now().strftime('%Y%m%d')}.csv",
            "text/csv"
        )

# ===== FOOTER =====
st.markdown("---")
st.caption("🔒 This is a private dashboard. Unauthorized access is prohibited.")

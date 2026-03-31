<div id="connovateModal" class="modal-overlay connovate-modal-overlay" style="z-index: 10020;">
    <div class="modal-container connovate-modal-container">
        <div class="modal-top-bar">
            <span>Connovate</span>
            <button type="button" id="connovateCloseBtn" onclick="window.closeConnovateModal()">✕</button>
        </div>

        <div class="modal-body connovate-modal-body">
            <div class="connovate-hero">
                <div>
                    <div class="connovate-eyebrow">Connovate View</div>
                    <h2 id="connovateResidentName">-</h2>
                    <p id="connovateResidentMeta">Resident ID: -</p>
                </div>
                <span id="connovateStatus" class="status-tag">-</span>
            </div>

            <div class="connovate-panel connovate-floor-panel">
                <label>Ground Floor</label>
                <div class="connovate-svg-frame">
                    <img src="../assets/svg/GroundFloor.svg" alt="Ground Floor Plan" class="connovate-floor-image">
                </div>
            </div>

            <div class="connovate-panel connovate-floor-panel">
                <label>Second Floor</label>
                <div class="connovate-svg-frame">
                    <img src="../assets/svg/SecondFloor.svg" alt="Second Floor Plan" class="connovate-floor-image">
                </div>
            </div>
        </div>

        <div class="modal-footer connovate-modal-footer">
            <button type="button" class="btn-cancel" onclick="window.closeConnovateModal()">Close</button>
            <button type="button" class="primary-btn" id="connovateManageBtn">Go to Management Profile</button>
        </div>
    </div>
</div>

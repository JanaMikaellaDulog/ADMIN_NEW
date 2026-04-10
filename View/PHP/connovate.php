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

            <div class="connovate-grid">
                <div class="connovate-card">
                    <label>Lot Context</label>
                    <span id="connovateLotContext">No lot selected</span>
                </div>
                <div class="connovate-card">
                    <label>Floor</label>
                    <select id="connovateFloorSelect" class="connovate-select">
                        <option value="GROUND FLOOR">Ground Floor</option>
                        <option value="SECOND FLOOR">Second Floor</option>
                    </select>
                </div>
                <div class="connovate-card">
                    <label>Done Panels</label>
                    <span id="connovateDoneCount">0</span>
                </div>
                <div class="connovate-card">
                    <label>Remaining Panels</label>
                    <span id="connovateRemainingCount">0</span>
                </div>
                <div class="connovate-card">
                    <label>Finished</label>
                    <span id="connovateFinishedCount">0</span>
                </div>
            </div>

            <div class="connovate-panel connovate-floor-panel">
                <label>Clickable Floor Plan</label>
                <div class="connovate-svg-frame">
                    <div class="connovate-svg-stage">
                        <object
                            id="connovateSvgObject"
                            class="connovate-floor-object"
                            type="image/svg+xml"
                            data="../assets/svg/GroundFloor.svg"
                            aria-label="Connovate floor plan">
                        </object>
                        <svg id="connovateHotspotOverlay" class="connovate-hotspot-overlay" viewBox="0 0 850 680" preserveAspectRatio="xMidYMid meet"></svg>
                    </div>
                </div>
                <p>Click a highlighted panel section to assign its control number and quantity.</p>
            </div>
        </div>

        <div class="modal-footer connovate-modal-footer">
            <button type="button" class="btn-cancel" onclick="window.closeConnovateModal()">Close</button>
            <button type="button" class="primary-btn" id="connovateManageBtn">Go to Management Profile</button>
        </div>
    </div>
</div>

<div id="connovatePanelModal" class="modal-overlay connovate-panel-modal-overlay" style="z-index: 10030;">
    <div class="modal-container connovate-panel-modal-container">
        <div class="modal-top-bar">
            <span>Panel Details</span>
            <button type="button" onclick="window.closeConnovatePanelModal()">✕</button>
        </div>
        <form id="connovatePanelForm">
            <div class="modal-body">
                <div class="connovate-panel connovate-card">
                    <label>Selected Panel</label>
                    <span id="connovatePanelTarget">No panel selected</span>
                </div>
                <div class="form-grid">
                    <div>
                        <label for="connovateControlNumber">Control Number</label>
                        <input type="text" id="connovateControlNumber" required>
                    </div>
                    <div>
                        <label for="connovateQuantity">Quantity</label>
                        <input type="number" id="connovateQuantity" min="1" required>
                    </div>
                </div>
                <div class="connovate-panel connovate-card" style="margin-top: 16px;">
                    <label>Panel Record</label>
                    <span id="connovatePanelRecordInfo">Not yet saved</span>
                </div>
            </div>
            <div class="modal-footer connovate-panel-footer" style="justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                <button type="button" id="connovateRemovePanelBtn" class="btn-delete" style="background: #b91c1c; color: #fff;">Remove Panel</button>
                <button type="button" class="btn-cancel" onclick="window.closeConnovatePanelModal()">Cancel</button>
                <button type="submit" class="primary-btn">Save Panel</button>
            </div>
        </form>
    </div>
</div>

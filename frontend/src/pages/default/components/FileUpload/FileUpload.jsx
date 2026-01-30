import React, { useEffect, useState, useRef } from "react";
import { Button, Table, Pagination } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import ApiService from "../../../../services/Api.service";
import { toast } from "react-toastify";
import { bytesToMB, formatIsoDate } from "../../../../utils/helper";
import DeleteConfirmModal from "../../../../components/confirmation.modal";
import "./FileUpload.scss";

const PdfManager = () => {
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const filesPerPage = 5;
  const fileInputRef = useRef(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletetionItem, setdeletetionItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    fetchAllFiles();
  }, []);

  const fetchAllFiles = async () => {
    let { data, error } = await ApiService.getAllFiles(searchParams.get("id"));

    if (error) {
      toast.error(error.response.data.message);
      return;
    }

    if (data) {
      setFiles(data.result);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files[0]);
  };

  const uploadFile = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("chatbot_id", searchParams.get("id"));
    formData.append("namespace_id", searchParams.get("namespace_id"));
    formData.append("files", selectedFiles);

    let { data, error } = await ApiService.uploadFile(formData);
    setLoading(false);

    if (error) {
      toast.error(error.response.data.message);
      return;
    }

    if (data) {
      fetchAllFiles();
      resetFileInput();
    }
  };

  const resetFileInput = () => {
    setSelectedFiles(null);
    fileInputRef.current.value = "";
  };

  const handleDeleteClick = (item) => {
    setdeletetionItem(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletetionItem) return;
    setIsDeleting(true);

    let payload = {
      id: deletetionItem._id["$oid"],
      name: deletetionItem.name,
      namespace_id: deletetionItem.namespace_id,
    };
    let { data, error } = await ApiService.deleteFile(payload);

    if (error) {
      toast.error(error.response.data.message);
    }

    if (data) {
      setCurrentPage(1);
      fetchAllFiles();
    }
    setIsDeleting(false);
    setdeletetionItem(null);
    setShowDeleteModal(false);
  };

  // Pagination logic
  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);
  const totalPages = Math.ceil(files.length / filesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="pm-files">
      <div className="pm-card pm-files-head">
        <div>
          <div className="pm-eyebrow">Documents</div>
          <h3 className="pm-h3 mb-0">
            <i className="bi bi-cloud-upload me-2" />
            Upload PDFs
          </h3>
          <div className="pm-muted pm-small">
            Attach documents to this bot so it can answer questions.
          </div>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Button
            variant="outline-secondary"
            onClick={() => navigate(-1)}
            className="px-3"
          >
            <i className="bi bi-arrow-left me-2" />
            Back
          </Button>
        </div>
      </div>

      <div className="pm-files-grid">
        <div className="pm-card">
          <div className="pm-section-title">
            <div className="fw-bold">Upload</div>
            <div className="pm-muted pm-small">PDF only</div>
          </div>

          <div className="mt-3">
            <label className="form-label fw-semibold">Choose file</label>
            <input
              type="file"
              className="form-control"
              accept="application/pdf"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <div className="pm-muted pm-small mt-2">
              {selectedFiles ? (
                <>
                  <i className="bi bi-filetype-pdf me-2" />
                  {selectedFiles.name}
                </>
              ) : (
                "Select a PDF to upload."
              )}
            </div>
          </div>

          <div className="mt-3 d-grid">
            <Button
              variant="primary"
              onClick={uploadFile}
              disabled={!selectedFiles || loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Uploading…
                </>
              ) : (
                <>
                  <i className="bi bi-upload me-2" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="pm-card">
          <div className="pm-section-title pm-section-title-row">
            <div>
              <div className="fw-bold">Uploaded files</div>
              <div className="pm-muted pm-small">
                {files.length} file{files.length === 1 ? "" : "s"}
              </div>
            </div>
          </div>

          {files.length === 0 ? (
            <div className="pm-empty">
              <div className="pm-empty-ico">
                <i className="bi bi-file-earmark-arrow-up" />
              </div>
              <div className="pm-empty-title">No documents yet</div>
              <div className="pm-muted pm-small">
                Upload a PDF and start chatting with your bot.
              </div>
            </div>
          ) : (
            <>
              <div className="table-responsive pm-table-wrap mt-3">
                <Table responsive hover className="align-middle pm-dark-table mb-0">
                  <thead>
                    <tr>
                      <th style={{ width: 60 }}>#</th>
                      <th>File</th>
                      <th style={{ width: 120 }}>Size</th>
                      <th style={{ width: 240 }}>Uploaded</th>
                      <th style={{ width: 120 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentFiles.map((file, index) => (
                      <tr key={file._id["$oid"]}>
                        <td className="pm-muted">{indexOfFirstFile + index + 1}</td>
                        <td>
                          <div className="fw-semibold">{file?.name}</div>
                        </td>
                        <td className="pm-muted">
                          {bytesToMB(file?.size).toFixed(2)} MB
                        </td>
                        <td className="pm-muted">
                          {formatIsoDate(file?.createdAt?.["$date"])}
                        </td>
                        <td>
                          <Button
                            onClick={() => handleDeleteClick(file)}
                            size="sm"
                            variant="outline-secondary"
                          >
                            <i className="bi bi-trash3 me-1" />
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {totalPages > 1 && (
                <Pagination size="sm" className="justify-content-end mt-3">
                  <Pagination.First
                    onClick={() => paginate(1)}
                    disabled={currentPage === 1}
                  />
                  <Pagination.Prev
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  />

                  {(() => {
                    const pageNumbers = [];
                    const maxVisible = 3;
                    let start = Math.max(
                      1,
                      currentPage - Math.floor(maxVisible / 2)
                    );
                    let end = start + maxVisible - 1;

                    if (end > totalPages) {
                      end = totalPages;
                      start = Math.max(1, end - maxVisible + 1);
                    }

                    for (let i = start; i <= end; i++) {
                      pageNumbers.push(
                        <Pagination.Item
                          key={i}
                          active={i === currentPage}
                          onClick={() => paginate(i)}
                        >
                          {i}
                        </Pagination.Item>
                      );
                    }

                    return pageNumbers;
                  })()}

                  <Pagination.Next
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                  <Pagination.Last
                    onClick={() => paginate(totalPages)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              )}
            </>
          )}
        </div>
      </div>

      <DeleteConfirmModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete "${deletetionItem?.name}"?`}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default PdfManager;

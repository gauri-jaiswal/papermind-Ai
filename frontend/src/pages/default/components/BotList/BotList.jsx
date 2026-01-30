import React, { useState, useEffect } from "react";
import "./BotList.scss";
import { Table, Pagination, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ApiService from "../../../../services/Api.service";
import { toast } from "react-toastify";
import { formatIsoDate } from "../../../../utils/helper";

const BotList = () => {
  const [bots, setBots] = useState([]);
  const [formData, setFormData] = useState({ bot_name: "", description: "" });
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const botsPerPage = 4;

  useEffect(() => {
    fetchAllChatBots();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { bot_name, description } = formData;

    if (!bot_name || !description) {
      toast.error("Please fill in all fields.");
      setLoading(false);

      return;
    }

    let { data, error } = await ApiService.createChatBot(formData);
    setLoading(false);

    if (error) {
      toast.error(error.response.data.message);
      return;
    }

    if (data) {
      fetchAllChatBots();
      toast.success(data.message);
    }

    setFormData({ bot_name: "", description: "" });
  };

  const fetchAllChatBots = async (e) => {
    let { data, error } = await ApiService.getAllChatBots({});

    if (error) {
      toast.error(error.response.data.message);
      return;
    }

    if (data) {
      setBots(data.result);
    }
  };

  // Pagination logic
  const indexOfLastBot = currentPage * botsPerPage;
  const indexOfFirstBot = indexOfLastBot - botsPerPage;
  const currentBots = bots.slice(indexOfFirstBot, indexOfLastBot);
  const totalPages = Math.ceil(bots.length / botsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  let navigate = useNavigate();

  const goToPage = (url, id, namespace_id = "") => {
    navigate(`${url}?id=${id}&namespace_id=${namespace_id}`);
  };

  return (
    <div className="pm-bots">
      <div className="pm-grid">
        <div className="pm-card pm-create">
          <div className="pm-card-head">
            <div>
              <div className="pm-eyebrow">Create</div>
              <h3 className="pm-h3">
                <i className="bi bi-robot me-2" />
                New knowledge bot
              </h3>
              <div className="pm-muted pm-small">
                Give it a name and short description.
              </div>
            </div>
          </div>

          <form onSubmit={handleCreate} className="mt-3">
            <div className="mb-3">
              <label className="form-label fw-semibold">Bot name</label>
              <input
                type="text"
                name="bot_name"
                className="form-control form-control-lg"
                placeholder="e.g. HR handbook bot"
                value={formData.bot_name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                name="description"
                className="form-control form-control-lg"
                rows="3"
                placeholder="What should this bot be good at?"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <button
              type="submit"
              className="btn btn-primary w-100 py-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Creating…
                </>
              ) : (
                <>
                  <i className="bi bi-plus-lg me-2" />
                  Create bot
                </>
              )}
            </button>
          </form>
        </div>

        <div className="pm-card pm-table">
          <div className="pm-card-head pm-card-head-row">
            <div>
              <div className="pm-eyebrow">Manage</div>
              <h3 className="pm-h3 mb-0">Your bots</h3>
              <div className="pm-muted pm-small">
                Upload documents and start chatting.
              </div>
            </div>
            <div className="pm-pill pm-muted">
              <i className="bi bi-collection me-2" />
              {bots.length} total
            </div>
          </div>

          {bots.length === 0 ? (
            <div className="pm-empty">
              <div className="pm-empty-ico">
                <i className="bi bi-robot" />
              </div>
              <div className="pm-empty-title">No bots yet</div>
              <div className="pm-muted pm-small">
                Create your first bot on the left to get started.
              </div>
            </div>
          ) : (
            <>
              <div className="table-responsive pm-table-wrap">
                <Table hover className="align-middle pm-dark-table mb-0">
                  <thead>
                    <tr>
                      <th style={{ width: 60 }}>#</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th style={{ width: 220 }}>Created</th>
                      <th style={{ width: 240 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentBots.map((bot, index) => (
                      <tr key={bot._id["$oid"]}>
                        <td className="pm-muted">
                          {indexOfFirstBot + index + 1}
                        </td>
                        <td className="fw-semibold">{bot?.bot_name}</td>
                        <td className="pm-muted">{bot?.description}</td>
                        <td className="pm-muted">
                          {formatIsoDate(bot?.created_at?.["$date"])}
                        </td>
                        <td>
                          <div className="d-flex gap-2 flex-wrap">
                            <Button
                              onClick={() => {
                                goToPage(
                                  "/default/doc-upload",
                                  bot._id["$oid"],
                                  bot.namespace_id
                                );
                              }}
                              size="sm"
                              variant="outline-secondary"
                            >
                              <i className="bi bi-cloud-upload me-1" />
                              Upload
                            </Button>
                            <Button
                              onClick={() => {
                                goToPage(
                                  "/default/chat",
                                  bot._id["$oid"],
                                  bot.namespace_id
                                );
                              }}
                              size="sm"
                              variant="primary"
                            >
                              <i className="bi bi-chat-dots me-1" />
                              Chat
                            </Button>
                          </div>
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
    </div>
  );
};

export default BotList;

import { useState, useEffect } from "react";
import { Table, Typography, message, Button, Popconfirm } from "antd";
import PieceForm from "../piezas/insert-piece";
import { useParams } from "react-router-dom";

const API_PIECES = "http://localhost:1337/api/piezas";

const OrderDetail = () => {
  const { id: orderId } = useParams();
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingPiece, setEditingPiece] = useState(null); // Estado para manejar la edición de piezas

  useEffect(() => {
    fetchPieces();
  }, []);

  // Obtener la lista de piezas
  const fetchPieces = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_PIECES}?populate[material][fields][0]=material&populate[cantoL1][fields][0]=code&populate[cantoL2][fields][0]=code&populate[cantoA1][fields][0]=code&populate[cantoA2][fields][0]=code&filters[pedido][documentId][$eq]=${orderId}&sort=updatedAt:desc`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setPieces(data.data);
      } else {
        throw new Error(data.error?.message || "Error desconocido");
      }
    } catch (error) {
      message.error(`Error al cargar las piezas: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar una pieza
  const deletePiece = async (id) => {
    try {
      const response = await fetch(`${API_PIECES}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        message.success("Pieza eliminada correctamente");
        fetchPieces(); // Actualizar la lista después de eliminar
      } else {
        const data = await response.json();
        throw new Error(data.error?.message || "Error desconocido");
      }
    } catch (error) {
      message.error(`Error al eliminar la pieza: ${error.message}`);
    }
  };

  // Manejar la acción de editar
  const handleEdit = (piece) => {
    const pieceData = {
      material: piece?.material?.documentId,
      veta: piece?.veta,
      largo: piece?.largo,
      ancho: piece?.ancho,
      cantidad: piece?.cantidad,
      cantoL1: piece?.cantoL1?.documentId,
      cantoL2: piece?.cantoL2?.documentId,
      cantoA1: piece?.cantoA1?.documentId,
      cantoA2: piece?.cantoA2?.documentId,
    };

    console.log("🚀 ~ handleEdit ~ pieceData.cantoA2:", pieceData);

    setEditingPiece({ id: piece.documentId, data: pieceData }); // Establecer pieza en edición
  };

  // Manejar la acción de guardar cambios
  const handleSave = async (values) => {
    if (!editingPiece) return;
    try {
      const response = await fetch(`${API_PIECES}/${editingPiece.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ data: values }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success("Pieza actualizada correctamente");
        setEditingPiece(null); // Finalizar edición
        fetchPieces(); // Actualizar la lista después de guardar
      } else {
        throw new Error(data.error?.message || "Error desconocido");
      }
    } catch (error) {
      message.error(`Error al guardar la pieza: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <PieceForm
        orderId={orderId}
        onSuccess={fetchPieces}
        initialValues={editingPiece?.data} // Pasar valores iniciales si está en modo edición
        onSave={handleSave} // Callback para guardar cambios
        onCancel={() => setEditingPiece(null)} // Cancelar edición
      />

      <Typography.Title level={3}>Detalles de la Orden</Typography.Title>
      <Table
        dataSource={pieces}
        columns={[
          { title: "Material", dataIndex: ["material", "material"], key: "material" },
          { title: "Largo", dataIndex: ["largo"], key: "largo" },
          { title: "Ancho", dataIndex: ["ancho"], key: "ancho" },
          { title: "Cantidad", dataIndex: ["cantidad"], key: "cantidad" },
          { title: "Canto L1", dataIndex: ["cantoL1", "code"], key: "code" },
          { title: "Canto L2", dataIndex: ["cantoL2", "code"], key: "code" },
          { title: "Canto A1", dataIndex: ["cantoA1", "code"], key: "code" },
          { title: "Canto A2", dataIndex: ["cantoA2", "code"], key: "code" },
          {
            title: "Acciones",
            key: "acciones",
            render: (_, record) => (
              <>
                <Button type="link" onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
                  Editar
                </Button>
                {/* <Popconfirm
                  title="¿Estás seguro de eliminar esta pieza?"
                  onConfirm={() => deletePiece(record.documentId)}
                  okText="Sí"
                  cancelText="No">
                  <Button type="link" danger>
                    Eliminar
                  </Button>
                </Popconfirm> */}
                <Button type="link" onClick={() => deletePiece(record.documentId)} danger>
                  Eliminar
                </Button>
              </>
            ),
          },
        ]}
        rowKey={(record) => record.documentId}
        onRow={(record) => ({
          onDoubleClick: () => handleEdit(record), // Redirección al hacer doble clic en la fila
        })}
        loading={loading}
      />
    </div>
  );
};

export default OrderDetail;

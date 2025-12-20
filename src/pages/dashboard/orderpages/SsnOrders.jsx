import React, { useEffect, useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";
import {
  Table,
  Checkbox,
  Button,
  Group,
  Text,
  Paper,
  Title,
  ScrollArea,
  Badge,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { IconTrash, IconDownload } from "@tabler/icons-react";

function SsnOrders(props) {
  const [todaysOrders, setTodaysOrders] = useState([]);
  const [yesterdaysOrders, setYesterdaysOrders] = useState([]);
  const [earlierOrders, setEarlierOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();
  const { auth } = useAuth();

  //  sorting orders
  useEffect(() => {
    if (!props?.ssn || !Array.isArray(props.ssn)) return;

    // Convert date strings to Date objects and split into categories.
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const todayOrders = [];
    const yesterdayOrders = [];
    const earlierOrders = [];

    props.ssn.forEach((order) => {
      // Skip deleted orders
      if (order.isDeleted) return;

      const purchaseDate = new Date(order.purchaseDate);
      if (purchaseDate.toDateString() === today.toDateString()) {
        todayOrders.push(order);
      } else if (purchaseDate.toDateString() === yesterday.toDateString()) {
        yesterdayOrders.push(order);
      } else {
        earlierOrders.push(order);
      }
    });

    setTodaysOrders(todayOrders);
    setYesterdaysOrders(yesterdayOrders);
    setEarlierOrders(earlierOrders);
  }, [props?.ssn]);

  // Handle order selection
  const handleOrderSelect = (orderId, checked) => {
    const newSelected = new Set(selectedOrders);
    if (checked) {
      newSelected.add(orderId);
    } else {
      newSelected.delete(orderId);
    }
    setSelectedOrders(newSelected);
  };

  // Handle select all
  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      const allOrderIds = [
        ...todaysOrders,
        ...yesterdaysOrders,
        ...earlierOrders,
      ].map((order) => order._id || order.id);
      setSelectedOrders(new Set(allOrderIds));
    } else {
      setSelectedOrders(new Set());
    }
  };

  const removeProducts = (data) => {
    return axios.patch("/orders/remove", data);
  };

  const {
    mutate: removeMutate,
    isLoading: loadingMutate,
    error,
  } = useMutation(removeProducts, {
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Success");
      queryClient.invalidateQueries([`orders-${auth?.userId}`]);

      // Update local state by removing selected orders
      const removeSelected = (orders) =>
        orders.filter((order) => !selectedOrders.has(order._id || order.id));

      setTodaysOrders((prev) => removeSelected(prev));
      setYesterdaysOrders((prev) => removeSelected(prev));
      setEarlierOrders((prev) => removeSelected(prev));

      // Clear selections
      setSelectedOrders(new Set());
      setSelectAll(false);

      // Call parent function to refresh data if available
      if (props.onOrdersDeleted) {
        props.onOrdersDeleted(Array.from(selectedOrders));
      }
    },
    onError: (err) => {
      const text = err?.response?.data?.message;
      toast.error(text);

      if (!err.response.data.message) {
        toast.error("something went wrong");
      }
    },
  });

  // Bulk delete selected orders
  const bulkDeleteOrders = async (permanent = false) => {
    if (selectedOrders.size === 0) {
      alert("Please select orders to delete");
      return;
    }

    const confirmMessage = permanent
      ? `Are you sure you want to permanently delete ${selectedOrders.size} order(s)? This action cannot be undone.`
      : `Are you sure you want to delete ${selectedOrders.size} order(s)?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      const data = {
        userId: auth?.userId,
        productIds: Array.from(selectedOrders),
      };

      removeMutate(data);
    } catch (error) {
      console.error("Error bulk deleting orders:", error);
      toast.error("Failed to delete orders. Please try again.");
    } finally {
    }
  };

  const instructions =
    "INSTRUCTIONS on how to use fafullz.com Matched Fullz.\n\n" +
    "- Go to FSAID Website\n" +
    '- Enter the "Email" as username on the login screen\n' +
    '- Enter "FA Pass" as Password on the login screen\n\n' +
    "Option 1:\n" +
    "Login using Email Verification Code:\n" +
    "- Go to mail.tm website\n" +
    "- Head over to the top right corner and click on profile then login\n" +
    "- Enter the Email and Email Pass and login\n" +
    "You will receive your code there then proceed.\n\n" +
    "Option 2 (Recommended):\n" +
    "Login using Backup Code:\n" +
    '- Instead of proceeding with "Send Code"; proceed with "Help me access my account"\n' +
    '- Select the "Backup Code & Challenge Questions" and click "Enter Code"\n' +
    '- Enter the Backup Code from the fullz and click "Continue"\n' +
    "- Enter the answers from the fullz SecurityQ&A\n" +
    "- Then proceed.\n\n" +
    "Once in, remember to change the email to your own, update the address and the username.\n\n";

  // download orders function.
  const downloadOrders = (orders) => {
    // Create a text representation of the orders
    const orderText =
      "SSN/DOB Orders \n\n" +
      instructions +
      orders
        ?.map((order, index) => {
          return `Order ID: ${index + 1}\nName:${order?.firstName || ""}  ${
            order?.lastName || ""
          }  \nSSN:${order?.ssn || ""}\nDOB:${
            order?.dob?.split("T")[0] || ""
          }\nAddress:${order?.address || ""}\nCity:${
            order?.city || ""
          }\nState: ${order?.state || ""}\nZip:${order?.zip || ""}\nEmail:${
            order?.email || ""
          }\nEmail Pass:${order?.emailPass || ""}\nfa Uname:${
            order?.faUname || ""
          }\nfa Pass:${order?.faPass || ""}\nBackup code:${
            order?.backupCode || ""
          }\n Security Q&A:${order?.securityQa || ""}\nDescription:  ${
            order.description || ""
          }\nCS:  ${order.cs || ""}\nPurchase Date:  ${
            order.purchaseDate || ""
          }\nEnrollment:  ${order.enrollment || ""}  \n\n_______________________________________ \n`;
        })
        .join("\n");

    // Create a Blob containing the text
    const blob = new Blob([orderText], { type: "text/plain" });

    // Create a download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "SSN orders.txt";

    // Simulate a click to trigger the download
    link.click();
  };

  /**
   * Function to download orders data as CSV
   * @param {Array} orders - Array of order objects
   */
  const downloadOrdersAsCSV = (orders) => {
    // Verify inputs
    if (!Array.isArray(orders) || orders.length === 0) {
      console.error("Orders data is empty or invalid");
      return;
    }

    // Create a copy of the orders with the excluded fields removed
    const filteredOrders = orders.map((order) => {
      const orderCopy = { ...order };
      // Remove the excluded fields
      delete orderCopy.sellerId;
      delete orderCopy.base;
      delete orderCopy._id;
      delete orderCopy.price;
      delete orderCopy.status;
      delete orderCopy.isPaid;
      delete orderCopy.productType;
      delete orderCopy.__v;
      delete orderCopy.createdAt;
      delete orderCopy.updatedAt;
      delete orderCopy.isDeleted;
      delete orderCopy.deletedAt;
      return orderCopy;
    });

    // Create CSV header from the keys of the first filtered order object
    const headers = Object.keys(filteredOrders[0]);

    // Create CSV content
    let csvContent = headers.join(",") + "\n";

    // Add data rows
    filteredOrders.forEach((order) => {
      const row = headers
        .map((header) => {
          // Format the value properly for CSV
          const value = order[header];
          // Handle special cases, null, undefined, and escape commas and quotes
          if (value === null || value === undefined) {
            return "";
          }

          // Convert to string and escape quotes by doubling them
          const stringValue = String(value).replace(/"/g, '""');

          // Wrap value in quotes if it contains commas, quotes, or newlines
          if (
            stringValue.includes(",") ||
            stringValue.includes('"') ||
            stringValue.includes("\n")
          ) {
            return `"${stringValue}"`;
          }

          return stringValue;
        })
        .join(",");

      csvContent += row + "\n";
    });

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "orders_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper for truncated cells
  const TruncatedCell = ({ text, maxWidth = 150 }) => {
    if (!text) return null;
    return (
        <Tooltip label={text} multiline width={300} withinPortal>
            <Text truncate style={{ maxWidth, cursor: "help" }} color="inherit">
                {text}
            </Text>
        </Tooltip>
    );
  };

  // Render table with delete functionality
  const renderOrderTable = (orders, title) => {
    if (orders.length === 0) return null;

    return (
      <Paper p="md" shadow="sm" radius="md" mb="xl" style={{ backgroundColor: '#1f2937' }}>
        <Group position="apart" mb="md">
          <Title order={4} color="gray.2">{title}</Title>
          <Group spacing="xs">
            <Button
              size="xs"
              variant="light"
              color="blue"
              leftIcon={<IconDownload size={16} />}
              onClick={() => downloadOrders(orders)}
            >
              Download
            </Button>
            <Button
              size="xs"
              variant="light"
              color="cyan"
              leftIcon={<IconDownload size={16} />}
              onClick={() => downloadOrdersAsCSV(orders)}
            >
              CSV
            </Button>
          </Group>
        </Group>

        <ScrollArea>
           <Table striped highlightOnHover withBorder withColumnBorders style={{ minWidth: "1500px" }}>
            <thead style={{ backgroundColor: '#111827' }}>
              <tr>
                <th style={{ width: 40 }}>
                  <Checkbox
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.currentTarget.checked)}
                  />
                </th>
                <th style={{ color: '#d1d5db' }}>Base</th>
                <th style={{ color: '#d1d5db' }}>Name</th>
                <th style={{ color: '#d1d5db' }}>DOB</th>
                <th style={{ color: '#d1d5db' }}>Description</th>
                <th style={{ color: '#d1d5db' }}>State</th>
                <th style={{ color: '#d1d5db' }}>City</th>
                <th style={{ color: '#d1d5db' }}>Zip</th>
                <th style={{ color: '#d1d5db' }}>SSN</th>
                <th style={{ color: '#d1d5db' }}>Address</th>
                <th style={{ color: '#d1d5db' }}>Email</th>
                <th style={{ color: '#d1d5db' }}>Email Pass</th>
                <th style={{ color: '#d1d5db' }}>FA Uname</th>
                <th style={{ color: '#d1d5db' }}>FA Pass</th>
                <th style={{ color: '#d1d5db' }}>Backup Code</th>
                <th style={{ color: '#d1d5db', minWidth: 200 }}>Security Q&A</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((item, index) => {
                const orderId = item._id;
                const isSelected = selectedOrders.has(orderId);

                return (
                  <tr
                    key={orderId || index}
                    style={{ backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.2)' : undefined }}
                  >
                    <td>
                      <Checkbox
                        checked={isSelected}
                        onChange={(e) =>
                          handleOrderSelect(orderId, e.currentTarget.checked)
                        }
                      />
                    </td>
                    <td style={{ color: '#e5e7eb' }}>{item?.base}</td>
                    <td style={{ color: '#e5e7eb' }}>
                      <Text style={{ whiteSpace: 'nowrap' }}>
                        {item?.firstName || ""} {item?.lastName || ""}
                      </Text>
                    </td>
                    <td style={{ color: '#e5e7eb' }}>{item?.dob?.split("-")[0]}</td>
                    <td style={{ color: '#e5e7eb' }}>
                        <TruncatedCell text={item?.description} maxWidth={200} />
                    </td>
                    <td style={{ color: '#e5e7eb' }}>{item?.state}</td>
                    <td style={{ color: '#e5e7eb' }}>{item.city}</td>
                    <td style={{ color: '#e5e7eb' }}>{item?.zip}</td>
                     <td style={{ color: '#e5e7eb' }}>{item?.ssn}</td>
                    <td style={{ color: '#e5e7eb' }}>
                        <TruncatedCell text={item?.address} maxWidth={200} />
                    </td>
                    <td style={{ color: '#e5e7eb' }}>
                         <TruncatedCell text={item?.email} maxWidth={150} />
                    </td>
                    <td style={{ color: '#e5e7eb' }}>{item?.emailPass}</td>
                    <td style={{ color: '#e5e7eb' }}>{item?.faUname}</td>
                    <td style={{ color: '#e5e7eb' }}>{item?.faPass}</td>
                    <td style={{ color: '#e5e7eb' }}>{item?.backupCode}</td>
                    <td style={{ color: '#e5e7eb' }}>
                        <TruncatedCell text={item?.securityQa} maxWidth={250} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </ScrollArea>
      </Paper>
    );
  };

  const totalOrders =
    todaysOrders.length + yesterdaysOrders.length + earlierOrders.length;

  return (
    <div>
      <div className="mb-[30px]">
        {/* Bulk Actions */}
        {selectedOrders.size > 0 && (
          <Paper p="md" shadow="sm" radius="md" mb="md" style={{ backgroundColor: '#f3f4f6' }}>
            <Group position="apart">
              <Text size="sm" color="dark">
                {selectedOrders.size} order(s) selected
              </Text>
              <Group spacing="xs">
                 <Button
                    color="red"
                    size="xs"
                    onClick={() => bulkDeleteOrders(false)}
                    loading={loadingMutate}
                    leftIcon={<IconTrash size={16} />}
                 >
                    Delete Selected
                 </Button>
                 <Button
                    variant="default"
                    size="xs"
                    onClick={() => {
                        setSelectedOrders(new Set());
                        setSelectAll(false);
                    }}
                 >
                    Clear Selection
                 </Button>
              </Group>
            </Group>
          </Paper>
        )}

        <div className="overflow-x-auto mb-3">
          <div style={{ marginBottom: 20 }}>
            <Title order={2} align="center" color="gray.2">
              {totalOrders === 0
                ? "No Orders!"
                : `Total Orders: ${totalOrders}`}
            </Title>
          </div>

          {loadingMutate && (
             <div className="text-center py-4">
              <Text color="dimmed">Processing...</Text>
            </div>
          )}

          {renderOrderTable(todaysOrders, "Today's Orders")}
          {renderOrderTable(yesterdaysOrders, "Yesterday's Orders")}
          {renderOrderTable(
            earlierOrders,
            !todaysOrders.length && !yesterdaysOrders.length
              ? "All Orders"
              : "Earlier Orders"
          )}
        </div>
      </div>
    </div>
  );
}

export default SsnOrders;

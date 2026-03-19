import { Modal, Space, Card, Checkbox, TimePicker } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

type StoreHoursRow = {
  dayOfWeek: number;
  dayLabel: string;
  isOpen: boolean;
  openTime?: any;
  closeTime?: any;
};

const buildDefaultHours = (): StoreHoursRow[] => [
  { dayOfWeek: 1, dayLabel: 'Monday', isOpen: false },
  { dayOfWeek: 2, dayLabel: 'Tuesday', isOpen: false },
  { dayOfWeek: 3, dayLabel: 'Wednesday', isOpen: false },
  { dayOfWeek: 4, dayLabel: 'Thursday', isOpen: false },
  { dayOfWeek: 5, dayLabel: 'Friday', isOpen: false },
  { dayOfWeek: 6, dayLabel: 'Saturday', isOpen: false },
  { dayOfWeek: 7, dayLabel: 'Sunday', isOpen: false },
];

type Props = {
  open: boolean;
  storeName?: string;
  onClose: () => void;
};

const StoreHoursModal = ({ open, storeName, onClose }: Props) => {
  const [rows, setRows] = useState<StoreHoursRow[]>(buildDefaultHours());

  useEffect(() => {
    if (open) {
      setRows(buildDefaultHours());
    }
  }, [open]);

  const updateRow = (dayOfWeek: number, patch: Partial<StoreHoursRow>) => {
    setRows((prev) =>
      prev.map((row) =>
        row.dayOfWeek === dayOfWeek ? { ...row, ...patch } : row
      )
    );
  };

  return (
    <Modal
      title={storeName ? `Store Hours - ${storeName}` : 'Store Hours'}
      open={open}
      onOk={onClose}
      onCancel={onClose}
      width={800}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={12}>
        {rows.map((row) => (
          <Card key={row.dayOfWeek} size="small">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '140px 120px 1fr 1fr',
                gap: 12,
                alignItems: 'center',
              }}
            >
              <div style={{ fontWeight: 600 }}>{row.dayLabel}</div>

              <Checkbox
                checked={row.isOpen}
                onChange={(e) =>
                  updateRow(row.dayOfWeek, {
                    isOpen: e.target.checked,
                    openTime: undefined,
                    closeTime: undefined,
                  })
                }
              >
                Open
              </Checkbox>

              <TimePicker
                value={row.openTime}
                disabled={!row.isOpen}
                format="HH:mm"
                onChange={(value) =>
                  updateRow(row.dayOfWeek, { openTime: value })
                }
              />

              <TimePicker
                value={row.closeTime}
                disabled={!row.isOpen}
                format="HH:mm"
                onChange={(value) =>
                  updateRow(row.dayOfWeek, { closeTime: value })
                }
              />
            </div>
          </Card>
        ))}
      </Space>
    </Modal>
  );
};

export default StoreHoursModal;
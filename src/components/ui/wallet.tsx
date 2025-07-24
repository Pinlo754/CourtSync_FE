"use client"

import { Button } from "../../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/label"
import { Badge } from "../../components/ui/badge"
import { useState, useEffect } from "react"
import type { TransactionAPI,  } from "../../types/wallet"
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Banknote,
} from "lucide-react"
import axiosInstance from "../../api/axiosInstance"
import { postData } from "../../api/fetchers"
import { useNavigate } from "react-router-dom"

interface WalletSectionProps {
  balance: number
}

const getTransactionIcon = (type: string) => {
  switch (type) {
    case "deposit":
      return <ArrowDownLeft className="h-4 w-4 text-green-600" />
    case "payment":
      return <ArrowUpRight className="h-4 w-4 text-red-600" />
    default:
      return <CreditCard className="h-4 w-4 text-gray-600" />
  }
}

const getTransactionStatus = (status: string) => {
  switch (status) {
    case "0":
      return {
        icon: <CheckCircle className="h-3 w-3" />,
        label: "Pending",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
      }
    case "1":
      return {
        icon: <Clock className="h-3 w-3" />,
        label: "Thành công",
        color: "text-green-600",
        bgColor: "bg-green-50",
      }
    case "2":
      return {
        icon: <XCircle className="h-3 w-3" />,
        label: "Cancel",
        color: "text-red-600",
        bgColor: "bg-red-50",
      }
    default:
      return {
        icon: <Clock className="h-3 w-3" />,
        label: "Không xác định",
        color: "text-gray-600",
        bgColor: "bg-gray-50",
      }
  }
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const formatAmount = (amount: number) => {
  const isPositive = amount > 0
  const formattedAmount = Math.abs(amount).toLocaleString("vi-VN")
  return {
    text: `${isPositive ? "+" : "-"}${formattedAmount} đ`,
    color: isPositive ? "text-green-600" : "text-red-600",
  }
}

export function WalletSection({ balance }: WalletSectionProps) {
  const { transactions, loading, error, depositAmount, setDepositAmount, depositing, handleDeposit, refetch } =
    useWallet()

  const quickAmounts = [50000, 100000, 200000, 500000, 1000000]

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Wallet className="h-5 w-5" />
                <span className="text-sm opacity-90">Số dư ví</span>
              </div>
              <div className="text-3xl font-bold">{balance.toLocaleString("vi-VN")} đ</div>
            </div>
            <div className="text-right">
              <Banknote className="h-12 w-12 opacity-20" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deposit Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Nạp tiền vào ví
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="depositAmount">Số tiền nạp</Label>
            <Input
              id="depositAmount"
              type="number"
              placeholder="Nhập số tiền (tối thiểu 10.000 đ)"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              min="10000"
              step="1000"
            />
          </div>

          {/* Quick Amount Buttons */}
          <div className="space-y-2">
            <Label>Chọn nhanh</Label>
            <div className="flex flex-wrap gap-2 w-[15%]">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => setDepositAmount(amount.toString())}
                  className="bg-transparent w-[10%]"
                >
                  {amount.toLocaleString("vi-VN")} đ
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleDeposit}
            disabled={depositing || !depositAmount}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {depositing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang xử lý...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Nạp tiền
              </>
            )}
          </Button>

          <div className="text-xs text-gray-500 space-y-1">
            <p>• Số tiền nạp tối thiểu: 10.000 VND</p>
            <p>• Số tiền nạp tối đa: 50.000.000 VND/lần</p>
            <p>• Phí giao dịch: Miễn phí</p>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Lịch sử giao dịch
            </CardTitle>
            <Button variant="outline" onClick={refetch} className="bg-transparent">
              Làm mới
            </Button>
          </div>
        </CardHeader>
        <CardContent className="h-[200px] overflow-y-scroll scrollbar-hide">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="space-y-1">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">{error}</p>
              <Button variant="outline" onClick={refetch} className="bg-transparent">
                Thử lại
              </Button>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Chưa có giao dịch nào</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96">
              {transactions.map((transaction) => {
                const status = getTransactionStatus(transaction.transactionStatus)
                const amount = formatAmount(transaction.amount)

                return (
                  <div
                    key={transaction.transactionId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">{getTransactionIcon(transaction.transactionType)}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 truncate">{transaction.name}</p>
                          <Badge variant="secondary" className={`text-xs ${status.bgColor} ${status.color}`}>
                            <span className="flex items-center space-x-1">
                              {status.icon}
                              <span>{status.label}</span>
                            </span>
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-gray-500">{formatDateTime(transaction.updateDate)}</p>
                          {transaction.bookingId > 0 && (
                            <Badge variant="outline" className="text-xs">
                              Booking #{transaction.bookingId}
                            </Badge>
                          )}
                        </div>
                        {transaction.description && (
                          <p className="text-xs text-gray-500 mt-1 truncate">{transaction.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className={`text-sm font-semibold ${amount.color}`}>{amount.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


const useWallet = () => {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [depositAmount, setDepositAmount] = useState<string>("")
  const [depositing, setDepositing] = useState(false)
  const navigate = useNavigate();
  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)
      const  response = await postData("/transaction/GetUserTransactions", {});
      const data: TransactionAPI = await response
      console.log("transactionAPI:", data.$values)
      setTransactions(data.$values || [])
    } catch (err) {
      console.error("Error fetching transactions:", err)
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi tải dữ liệu")
    } finally {
      setLoading(false)
    }
  }

  const handleDeposit = async () => {
    const amount = Number.parseFloat(depositAmount)

    if (!amount || amount <= 0) {
      alert("Vui lòng nhập số tiền hợp lệ")
      return
    }

    if (amount < 10000) {
      alert("Số tiền nạp tối thiểu là 10.000 VND")
      return
    }

    try {
      setDepositing(true)

      const response = await postData("/transaction/deposit", {
        amount: amount
      })
      const result = await response;
      window.location.href = response;
      localStorage.setItem("action", "deposit");
      if (result.success) {
        setDepositAmount("")
        fetchTransactions()
      } else {
        throw new Error(result.message || "Nạp tiền thất bại")
      }
    } catch (err) {
      console.error("Error depositing:", err)
    } finally {
      setDepositing(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  return {
    transactions,
    loading,
    error,
    depositAmount,
    setDepositAmount,
    depositing,
    handleDeposit,
    refetch: fetchTransactions,
  }
}

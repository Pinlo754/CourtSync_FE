import { Button } from "./Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { Badge } from "./badge"
import { MapPin, Clock, Phone, Mail, Users } from "lucide-react"
import type { Facility } from "../../types/Facility"
import { useNavigate } from "react-router-dom"

interface FacilityCardProps {
  facility: Facility
}

export function FacilityCard({ facility }: FacilityCardProps) {
  const navigate = useNavigate();
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={facility.facilityImageUrl || "/placeholder.svg"}
          alt={facility.FacilityName}
          className="w-full h-48 object-cover"
        />
        <Badge className="absolute top-3 left-3 bg-white text-gray-900">{facility.NumberOfCourts} sân</Badge>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-1">{facility.FacilityName}</CardTitle>
        <CardDescription className="flex items-center">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{facility.Address}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-2">{facility.Description}</p>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>
              {facility.OpeningTime} - {facility.ClosingTime}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 mr-2" />
            <span>{facility.Phone}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2" />
            <span className="line-clamp-1">{facility.Email}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span>{facility.NumberOfCourts} sân cầu lông</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-lg font-bold text-green-600">{facility.MinPrice} - {facility.MaxPrice}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button className="w-[120px]" onClick={() => navigate(`/facility/${facility.FacilityID}`)}>Đặt sân</Button>
        </div>
      </CardContent>
    </Card>
  )
}

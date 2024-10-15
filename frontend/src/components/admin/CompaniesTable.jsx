import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import url from "../../../images/empty_company_logo.png"
const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const navigate = useNavigate();
    useEffect(() => {
        const filteredCompany = companies.length >= 0 && companies.filter((company) => {
            if (!searchCompanyByText) {
                return true;
            }
            return company?.companyName?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
        setFilterCompany(filteredCompany);
    }, [companies, searchCompanyByText]);

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent registered companies</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Logo</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {

                        filterCompany?.map((company) => (

                            <tr key={company._id}>
                                <TableCell>
                                    <Avatar className="w-12 h-12 rounded-full object-cover">
                                        <AvatarImage src={company.logo ? (company.logo) :

                                            ("https://t4.ftcdn.net/jpg/05/34/63/15/360_F_534631520_Uzo44LIVqalKZhajcqtZ3q8YShvPFmSO.jpg")
                                            
                                        }
                                        >
                                        </AvatarImage>
                                        {company.logo == null? (<h1 className='absolute px-5 pt-2.5 text-lg'>?</h1>):("")};
                                    </Avatar>
                                </TableCell>

                                <TableCell>{company.companyName}</TableCell>
                                <TableCell>{company.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            <div onClick={() => navigate(`/admin/company/${company._id}`)} className='flex items-center gap-2 w-25 cursor-pointer'>
                                                <Edit2 className='w-fit' />
                                                <span>Edit</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </tr>

                        ))

                    }

                </TableBody>
            </Table>
        </div>
    )
}

export default CompaniesTable
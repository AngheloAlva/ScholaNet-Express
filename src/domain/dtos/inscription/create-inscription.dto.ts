export class CreateInscriptionDto {
  private constructor (
    public readonly student: string,
    public readonly program: string,
    public readonly status: string,
    public readonly enrollmentDate: Date
  ) {}

  static create (props: Record<string, string>): [string?, CreateInscriptionDto?] {
    const { student, program, status, enrollmentDate } = props

    if (student.length === 0) return ['Student is required']
    if (program.length === 0) return ['Program is required']
    if (status.length === 0) return ['Status is required']
    if (enrollmentDate.length === 0) return ['Enrollment date is required']

    return [undefined, new CreateInscriptionDto(student, program, status, new Date(enrollmentDate))]
  }
}

import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';

part 'institution_detail_mandates.g.dart';

/// Institution Detail Mandates
@JsonSerializable(includeIfNull: false)
class GovernanceInstitutionDetailMandates {
  const GovernanceInstitutionDetailMandates({required this.description, this.fromToPrecision, this.fromYear, required this.kind, this.toYear});
  final String description;
  final SharedDatePrecision? fromToPrecision;
  final int? fromYear;
  final String kind;
  final int? toYear;

  factory GovernanceInstitutionDetailMandates.fromJson(Map<String, dynamic> json) => _$GovernanceInstitutionDetailMandatesFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceInstitutionDetailMandatesToJson(this);
}

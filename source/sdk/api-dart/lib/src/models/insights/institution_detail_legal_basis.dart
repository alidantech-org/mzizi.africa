import 'package:json_annotation/json_annotation.dart';

part 'institution_detail_legal_basis.g.dart';

/// Institution Detail Legal Basis
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionDetailLegalBasis {
  const InsightsInstitutionDetailLegalBasis({
    required this.designation,
    required this.effect,
    this.effectCode,
    required this.excerpt,
    this.explanation,
    this.heading,
    required this.instrument,
    this.instrumentCode,
    this.provisionCode,
    required this.reviewStatus,
    required this.type,
    this.via,
  });
  final String designation;
  final String effect;
  final String? effectCode;
  final String excerpt;
  final String? explanation;
  final String? heading;
  final String instrument;
  final String? instrumentCode;
  final String? provisionCode;
  final String reviewStatus;
  final String type;
  final String? via;

  factory InsightsInstitutionDetailLegalBasis.fromJson(Map<String, dynamic> json) => _$InsightsInstitutionDetailLegalBasisFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionDetailLegalBasisToJson(this);
}

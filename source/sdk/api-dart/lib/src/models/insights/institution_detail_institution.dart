import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/institution_detail_institution_arm.dart';
import 'package:mzizi_api/src/models/insights/institution_detail_institution_basis.dart';
import 'package:mzizi_api/src/models/insights/institution_detail_institution_kind.dart';
import 'package:mzizi_api/src/models/insights/institution_detail_institution_parent.dart';

part 'institution_detail_institution.g.dart';

/// Institution Detail Institution
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionDetailInstitution {
  const InsightsInstitutionDetailInstitution({
    required this.arm,
    required this.basis,
    required this.children,
    required this.code,
    this.established,
    required this.functions,
    this.image,
    required this.kind,
    required this.leaders,
    required this.name,
    this.parent,
    required this.purpose,
  });
  final InsightsInstitutionDetailInstitutionArm arm;
  final InsightsInstitutionDetailInstitutionBasis basis;
  final double children;
  final String code;
  final String? established;
  final List<String> functions;
  final String? image;
  final InsightsInstitutionDetailInstitutionKind kind;
  final double leaders;
  final String name;
  final InsightsInstitutionDetailInstitutionParent? parent;
  final String purpose;

  factory InsightsInstitutionDetailInstitution.fromJson(Map<String, dynamic> json) => _$InsightsInstitutionDetailInstitutionFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionDetailInstitutionToJson(this);
}

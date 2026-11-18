import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/projects.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/reference/country.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'procurements.g.dart';

/// One public procurement process run by a buyer, optionally linked to a project.
@JsonSerializable(includeIfNull: false)
class CivicProcurements {
  const CivicProcurements({
    this.awardedOn,
    required this.buyerEntityId,
    this.categoryId,
    this.closesOn,
    required this.code,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    this.natureId,
    required this.procedureKindId,
    this.projectId,
    this.publishedOn,
    this.reference,
    this.sourceCitationId,
    this.statusId,
    this.title,
    required this.updatedAt,
    required this.version,
  });
  final DateTime? awardedOn;
  final String buyerEntityId;
  final String? categoryId;
  final DateTime? closesOn;
  final String code;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String? natureId;
  final String procedureKindId;
  final String? projectId;
  final DateTime? publishedOn;
  final String? reference;
  final String? sourceCitationId;
  final String? statusId;
  final String? title;
  final DateTime updatedAt;
  final int version;

  factory CivicProcurements.fromJson(Map<String, dynamic> json) => _$CivicProcurementsFromJson(json);

  Map<String, dynamic> toJson() => _$CivicProcurementsToJson(this);
}

import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/legal/instruments.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'editions.g.dart';

/// One edition of an instrument with its consolidation and commencement dates.
@JsonSerializable(includeIfNull: false)
class LegalEditions {
  const LegalEditions({
    this.ceasedOn,
    required this.code,
    this.commencedOn,
    this.consolidatedOn,
    required this.createdAt,
    this.deletedAt,
    required this.designation,
    required this.id,
    required this.instrumentId,
    this.repealedOn,
    this.supersedesId,
    required this.updatedAt,
    required this.version,
  });
  final DateTime? ceasedOn;
  final String code;
  final DateTime? commencedOn;
  final DateTime? consolidatedOn;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String designation;
  final String id;
  final String instrumentId;
  final DateTime? repealedOn;
  final String? supersedesId;
  final DateTime updatedAt;
  final int version;

  factory LegalEditions.fromJson(Map<String, dynamic> json) => _$LegalEditionsFromJson(json);

  Map<String, dynamic> toJson() => _$LegalEditionsToJson(this);
}

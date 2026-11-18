import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/legal/provision_kind.dart';
import 'package:mzizi_api/src/models/legal/instruments.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'provisions.g.dart';

/// Stable provision identity within one instrument; hierarchy stays within that instrument. One provision holds one statement.
@JsonSerializable(includeIfNull: false)
class LegalProvisions {
  const LegalProvisions({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.designation,
    required this.id,
    required this.instrumentId,
    required this.kind,
    this.parentId,
    required this.position,
    this.title,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String designation;
  final String id;
  final String instrumentId;
  final LegalProvisionKind kind;
  final String? parentId;
  final int position;
  final String? title;
  final DateTime updatedAt;
  final int version;

  factory LegalProvisions.fromJson(Map<String, dynamic> json) => _$LegalProvisionsFromJson(json);

  Map<String, dynamic> toJson() => _$LegalProvisionsToJson(this);
}

import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/official/individuals.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/validity_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'contacts.g.dart';

/// One sourced contact channel for exactly one identity; visibility class governs handling of private values.
@JsonSerializable(includeIfNull: false)
class OfficialContacts {
  const OfficialContacts({
    required this.createdAt,
    this.deletedAt,
    this.entityId,
    required this.id,
    this.individualId,
    required this.kindId,
    this.sourceCitationId,
    required this.updatedAt,
    this.validFrom,
    this.validUntil,
    required this.value,
    required this.version,
    required this.visibilityId,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? entityId;
  final String id;
  final String? individualId;
  final String kindId;
  final String? sourceCitationId;
  final DateTime updatedAt;
  final DateTime? validFrom;
  final DateTime? validUntil;
  final String value;
  final int version;
  final String visibilityId;

  factory OfficialContacts.fromJson(Map<String, dynamic> json) => _$OfficialContactsFromJson(json);

  Map<String, dynamic> toJson() => _$OfficialContactsToJson(this);
}

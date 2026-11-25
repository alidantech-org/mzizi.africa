import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'contacts.g.dart';

/// A public or official-business contact of a named thing.
@JsonSerializable(includeIfNull: false)
class OfficialContacts {
  const OfficialContacts({
    required this.createdAt,
    this.deletedAt,
    this.fromYear,
    required this.id,
    required this.identityId,
    required this.kindTerm,
    this.toYear,
    required this.updatedAt,
    required this.value,
    required this.version,
    required this.visibilityTerm,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final int? fromYear;
  final String id;
  final String identityId;
  final String kindTerm;
  final int? toYear;
  final DateTime updatedAt;
  final String value;
  final int version;
  final String visibilityTerm;

  factory OfficialContacts.fromJson(Map<String, dynamic> json) => _$OfficialContactsFromJson(json);

  Map<String, dynamic> toJson() => _$OfficialContactsToJson(this);
}

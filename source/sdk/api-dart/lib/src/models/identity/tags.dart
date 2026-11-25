import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/shared/association.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'tags.g.dart';

/// Loose editorial labels on named things, for related links and collections.
@JsonSerializable(includeIfNull: false)
class IdentityTags {
  const IdentityTags({required this.createdAt, this.deletedAt, required this.id, required this.identityId, required this.tagTerm});
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String identityId;
  final String tagTerm;

  factory IdentityTags.fromJson(Map<String, dynamic> json) => _$IdentityTagsFromJson(json);

  Map<String, dynamic> toJson() => _$IdentityTagsToJson(this);
}

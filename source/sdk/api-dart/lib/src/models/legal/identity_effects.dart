import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'identity_effects.g.dart';

/// Identity Effects
@JsonSerializable(includeIfNull: false)
class LegalIdentityEffects {
  const LegalIdentityEffects({required this.identityId, this.limit, this.offset});
  final String identityId;
  final int? limit;
  final int? offset;

  factory LegalIdentityEffects.fromJson(Map<String, dynamic> json) => _$LegalIdentityEffectsFromJson(json);

  Map<String, dynamic> toJson() => _$LegalIdentityEffectsToJson(this);
}

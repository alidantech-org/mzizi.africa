import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'country_scope.g.dart';

/// Country Scope
@JsonSerializable(includeIfNull: false)
class ReferenceCountryScope {
  const ReferenceCountryScope({required this.countryId, this.limit, this.offset});
  final String countryId;
  final int? limit;
  final int? offset;

  factory ReferenceCountryScope.fromJson(Map<String, dynamic> json) => _$ReferenceCountryScopeFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceCountryScopeToJson(this);
}

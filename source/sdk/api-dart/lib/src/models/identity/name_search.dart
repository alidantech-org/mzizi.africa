import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'name_search.g.dart';

/// Name Search
@JsonSerializable(includeIfNull: false)
class IdentityNameSearch {
  const IdentityNameSearch({this.limit, this.offset, required this.text});
  final int? limit;
  final int? offset;
  final String text;

  factory IdentityNameSearch.fromJson(Map<String, dynamic> json) => _$IdentityNameSearchFromJson(json);

  Map<String, dynamic> toJson() => _$IdentityNameSearchToJson(this);
}
